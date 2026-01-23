'use client';

import { useState } from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LinkWithRules } from '@/types';
import clsx from 'clsx';

interface LinkListReorderProps {
  links: LinkWithRules[];
  onReorder: (newOrder: LinkWithRules[]) => void;
  onEdit: (link: LinkWithRules) => void;
  onDelete: (id: number) => void;
  onSelect: (link: LinkWithRules) => void;
  selectedId: number | undefined;
}

export default function LinkListReorder({ 
  links, 
  onReorder, 
  onEdit, 
  onDelete,
  onSelect,
  selectedId
}: LinkListReorderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((item) => item.id === active.id);
      const newIndex = links.findIndex((item) => item.id === over?.id);
      
      onReorder(arrayMove(links, oldIndex, newIndex));
    }
  }

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={links.map(l => l.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3" role="list">
          {links.map((link, index) => (
            <SortableLinkItem 
              key={link.id} 
              link={link} 
              onEdit={() => onEdit(link)}
              onDelete={() => onDelete(link.id)}
              onSelect={() => onSelect(link)}
              isSelected={selectedId === link.id}
              index={index}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableLinkItem({ 
  link, 
  onEdit, 
  onDelete, 
  onSelect,
  isSelected,
  index 
}: { 
  link: LinkWithRules, 
  onEdit: () => void, 
  onDelete: () => void,
  onSelect: () => void,
  isSelected: boolean,
  index: number
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "bg-[#111] border rounded-lg p-4 flex items-center justify-between group transition-colors",
        isSelected ? "border-[#00C853] ring-1 ring-[#00C853]/50" : "border-[#222] hover:border-[#444]"
      )}
      onClick={onSelect}
      role="listitem"
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Drag Handle */}
        <button 
          {...attributes} 
          {...listeners}
          className="cursor-move p-2 text-[#666] hover:text-[#E6E6E6] focus:outline-none focus:ring-2 focus:ring-[#00C853] rounded"
          aria-label="Drag to reorder"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 6h8v2H4zM4 9h8v2H4z" />
          </svg>
        </button>

        <div className="flex-1">
          <h4 className={clsx(
            "font-medium transition-colors",
            link.is_active ? "text-[#E6E6E6]" : "text-[#666] line-through"
          )}>
            {link.title}
          </h4>
          <p className="text-sm text-[#9A9A9A] truncate max-w-[200px]">{link.url}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {link.rules.length > 0 && (
          <span className="px-2 py-0.5 text-xs bg-[#00C853]/20 text-[#00C853] rounded border border-[#00C853]/30">
            {link.rules[0].rule_type}
          </span>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-2 text-[#9A9A9A] hover:text-white rounded hover:bg-[#222]"
          aria-label="Edit link"
        >
          ✎
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-2 text-red-500 hover:text-red-400 rounded hover:bg-red-500/10"
          aria-label="Delete link"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
