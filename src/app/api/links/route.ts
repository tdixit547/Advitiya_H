// ============================================
// SMART LINK HUB - Links API
// CRUD operations for links
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { Link, CreateLinkInput, UpdateLinkInput } from '@/types';
import { readLinks, writeLinks, getLinksWithRules, readRules, writeRules } from '@/lib/storage';

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

  const linksWithRules = await getLinksWithRules();
  const hubLinks = linksWithRules.filter((l) => l.hub_id === parseInt(hubId));
  
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

    const links = await readLinks();
    
    // Calculate next ID
    const nextId = links.length > 0 ? Math.max(...links.map(l => l.id)) + 1 : 1;

    const newLink: Link = {
      id: nextId,
      hub_id,
      title,
      url,
      icon: icon || null,
      priority: priority || 0,
      click_count: 0,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    links.push(newLink);
    await writeLinks(links);

    return NextResponse.json({
      success: true,
      data: { ...newLink, rules: [] },
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

    const links = await readLinks();
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

    await writeLinks(links);

    // Fetch rules to return complete object
    const rules = await readRules();
    const linkRules = rules.filter(r => r.link_id === id);

    return NextResponse.json({
      success: true,
      data: { ...links[linkIndex], rules: linkRules },
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

  const linkId = parseInt(id);
  const links = await readLinks();
  const linkIndex = links.findIndex((l) => l.id === linkId);
  
  if (linkIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Link not found' },
      { status: 404 }
    );
  }

  // Remove link
  links.splice(linkIndex, 1);
  await writeLinks(links);

  // Cascade delete rules
  const rules = await readRules();
  const rulesToKeep = rules.filter(r => r.link_id !== linkId);
  if (rulesToKeep.length !== rules.length) {
    await writeRules(rulesToKeep);
  }

  return NextResponse.json({
    success: true,
    message: 'Link deleted successfully',
  });
}
