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

  if (links.length === 0) {
    return (
      <div className="text-center py-8 text-[#666]">
        <p className="text-sm">No links yet</p>
        <p className="text-xs mt-1">Click "+ Add New Link" to create one</p>
      </div>
    );
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
        <div className="space-y-2" role="list">
          {links.map((link) => (
            <SortableLinkItem
              key={link.id}
              link={link}
              onEdit={() => onEdit(link)}
              onDelete={() => onDelete(link.id)}
              onSelect={() => onSelect(link)}
              isSelected={selectedId === link.id}
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
}: {
  link: LinkWithRules,
  onEdit: () => void,
  onDelete: () => void,
  onSelect: () => void,
  isSelected: boolean,
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
      className={`bg-[#0a0a0a] border rounded-lg p-3 flex items-center gap-3 group transition-all cursor-pointer ${isSelected
          ? 'border-[#00C853] bg-[#00C853]/5'
          : 'border-[#222] hover:border-[#333]'
        }`}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-[#444] hover:text-[#666]"
        onClick={(e) => e.stopPropagation()}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 5h8v1.5H4zM4 9.5h8V11H4z" />
        </svg>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-medium text-sm truncate ${link.is_active ? 'text-white' : 'text-[#666] line-through'
          }`}>
          {link.title}
        </h4>
        <p className="text-xs text-[#666] truncate">{link.url}</p>
      </div>

      {/* Rule badges */}
      {link.rules.length > 0 && (
        <div className="flex gap-1">
          {link.rules.slice(0, 2).map((rule, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 text-[10px] bg-[#00C853]/20 text-[#00C853] rounded uppercase font-medium"
            >
              {rule.rule_type}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-1.5 text-[#666] hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 text-[#666] hover:text-red-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
