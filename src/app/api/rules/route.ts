// ============================================
// SMART LINK HUB - Rules API
// CRUD operations for link rules
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { LinkRule, CreateRuleInput, RuleType, RuleAction } from '@/types';

// In-memory storage for demo (replace with database in production)
let rules: LinkRule[] = [];
let nextId = 1;

// GET - Fetch all rules for a link
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const linkId = searchParams.get('link_id');

  if (!linkId) {
    return NextResponse.json({
      success: true,
      data: rules,
    });
  }

  const linkRules = rules.filter((r) => r.link_id === parseInt(linkId));
  
  return NextResponse.json({
    success: true,
    data: linkRules,
  });
}

// POST - Create a new rule
export async function POST(request: NextRequest) {
  try {
    const body: CreateRuleInput = await request.json();
    const { link_id, rule_type, conditions, action } = body;

    // Validate required fields
    if (!link_id || !rule_type || !conditions) {
      return NextResponse.json(
        { success: false, error: 'link_id, rule_type, and conditions are required' },
        { status: 400 }
      );
    }

    // Validate rule type
    if (!['TIME', 'DEVICE', 'LOCATION'].includes(rule_type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid rule_type. Must be TIME, DEVICE, or LOCATION' },
        { status: 400 }
      );
    }

    const newRule: LinkRule = {
      id: nextId++,
      link_id,
      rule_type: rule_type as RuleType,
      conditions,
      action: (action as RuleAction) || 'SHOW',
      is_active: true,
      created_at: new Date(),
    };

    rules.push(newRule);

    return NextResponse.json({
      success: true,
      data: newRule,
    });
  } catch (error) {
    console.error('[Rules API] Error creating rule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create rule' },
      { status: 500 }
    );
  }
}

// PUT - Update a rule
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Rule id is required' },
        { status: 400 }
      );
    }

    const ruleIndex = rules.findIndex((r) => r.id === id);
    if (ruleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Rule not found' },
        { status: 404 }
      );
    }

    // Update the rule
    rules[ruleIndex] = {
      ...rules[ruleIndex],
      ...updates,
    };

    return NextResponse.json({
      success: true,
      data: rules[ruleIndex],
    });
  } catch (error) {
    console.error('[Rules API] Error updating rule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update rule' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a rule
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Rule id is required' },
      { status: 400 }
    );
  }

  const ruleIndex = rules.findIndex((r) => r.id === parseInt(id));
  if (ruleIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Rule not found' },
      { status: 404 }
    );
  }

  rules.splice(ruleIndex, 1);

  return NextResponse.json({
    success: true,
    message: 'Rule deleted successfully',
  });
}
