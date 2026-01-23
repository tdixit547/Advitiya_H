// ============================================
// SMART LINK HUB - Links API
// CRUD operations for links
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { Link, CreateLinkInput, UpdateLinkInput, LinkWithRules, LinkRule } from '@/types';

// In-memory storage for demo (replace with database in production)
let links: LinkWithRules[] = [
  {
    id: 1,
    hub_id: 1,
    title: '🌐 My Website',
    url: 'https://example.com',
    icon: null,
    priority: 100,
    click_count: 150,
    is_active: true,
    rules: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    hub_id: 1,
    title: '💻 GitHub',
    url: 'https://github.com',
    icon: null,
    priority: 90,
    click_count: 120,
    is_active: true,
    rules: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    hub_id: 1,
    title: '💼 LinkedIn',
    url: 'https://linkedin.com',
    icon: null,
    priority: 80,
    click_count: 100,
    is_active: true,
    rules: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
];

let nextId = 4;

// GET - Fetch all links for a hub
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hubId = searchParams.get('hub_id');

  if (!hubId) {
    return NextResponse.json(
      { success: false, error: 'hub_id is required' },
      { status: 400 }
    );
  }

  const hubLinks = links.filter((l) => l.hub_id === parseInt(hubId));
  
  return NextResponse.json({
    success: true,
    data: hubLinks.sort((a, b) => b.priority - a.priority),
  });
}

// POST - Create a new link
export async function POST(request: NextRequest) {
  try {
    const body: CreateLinkInput = await request.json();
    const { hub_id, title, url, icon, priority } = body;

    // Validate required fields
    if (!hub_id || !title || !url) {
      return NextResponse.json(
        { success: false, error: 'hub_id, title, and url are required' },
        { status: 400 }
      );
    }

    const newLink: LinkWithRules = {
      id: nextId++,
      hub_id,
      title,
      url,
      icon: icon || null,
      priority: priority || 0,
      click_count: 0,
      is_active: true,
      rules: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    links.push(newLink);

    return NextResponse.json({
      success: true,
      data: newLink,
    });
  } catch (error) {
    console.error('[Links API] Error creating link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create link' },
      { status: 500 }
    );
  }
}

// PUT - Update a link
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates }: { id: number } & UpdateLinkInput = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Link id is required' },
        { status: 400 }
      );
    }

    const linkIndex = links.findIndex((l) => l.id === id);
    if (linkIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    // Update the link
    links[linkIndex] = {
      ...links[linkIndex],
      ...updates,
      updated_at: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: links[linkIndex],
    });
  } catch (error) {
    console.error('[Links API] Error updating link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update link' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a link
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Link id is required' },
      { status: 400 }
    );
  }

  const linkIndex = links.findIndex((l) => l.id === parseInt(id));
  if (linkIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Link not found' },
      { status: 404 }
    );
  }

  links.splice(linkIndex, 1);

  return NextResponse.json({
    success: true,
    message: 'Link deleted successfully',
  });
}
