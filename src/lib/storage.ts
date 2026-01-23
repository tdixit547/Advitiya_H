import fs from 'fs/promises';
import path from 'path';
import { Link, LinkWithRules, LinkRule } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const LINKS_FILE = path.join(DATA_DIR, 'links.json');
const RULES_FILE = path.join(DATA_DIR, 'rules.json');

// Initial demo data (Split into Links and Rules)
const DEMO_LINKS: Link[] = [
  {
    id: 1,
    hub_id: 1,
    title: '🌐 My Website',
    url: 'https://example.com',
    icon: null,
    priority: 100,
    click_count: 150,
    is_active: true,
    created_at: new Date('2024-01-01T00:00:00.000Z'),
    updated_at: new Date('2024-01-01T00:00:00.000Z'),
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
    created_at: new Date('2024-01-01T00:00:00.000Z'),
    updated_at: new Date('2024-01-01T00:00:00.000Z'),
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
    created_at: new Date('2024-01-01T00:00:00.000Z'),
    updated_at: new Date('2024-01-01T00:00:00.000Z'),
  },
  {
    id: 4,
    hub_id: 1,
    title: '📅 Join Meeting (9AM-5PM)',
    url: 'https://meet.google.com',
    icon: null,
    priority: 70,
    click_count: 50,
    is_active: true,
    created_at: new Date('2024-01-01T00:00:00.000Z'),
    updated_at: new Date('2024-01-01T00:00:00.000Z'),
  },
];

const DEMO_RULES: LinkRule[] = [
  {
    id: 1,
    link_id: 4,
    rule_type: 'TIME',
    conditions: { startHour: 9, endHour: 17 },
    action: 'SHOW',
    is_active: true,
    created_at: new Date('2024-01-01T00:00:00.000Z'),
  },
];

// Helper to revive dates from JSON
const dateReviver = (key: string, value: any) => {
  if (key === 'created_at' || key === 'updated_at') {
    return new Date(value);
  }
  return value;
};

// Helper to ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Basic CRUD for Links
export async function readLinks(): Promise<Link[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(LINKS_FILE, 'utf-8');
    return JSON.parse(data, dateReviver);
  } catch (error) {
    await writeLinks(DEMO_LINKS);
    return DEMO_LINKS;
  }
}

export async function writeLinks(links: Link[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(LINKS_FILE, JSON.stringify(links, null, 2));
}

// Basic CRUD for Rules
export async function readRules(): Promise<LinkRule[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(RULES_FILE, 'utf-8');
    return JSON.parse(data, dateReviver);
  } catch (error) {
    await writeRules(DEMO_RULES);
    return DEMO_RULES;
  }
}

export async function writeRules(rules: LinkRule[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(RULES_FILE, JSON.stringify(rules, null, 2));
}

// Joined Data Access
export async function getLinksWithRules(): Promise<LinkWithRules[]> {
  const links = await readLinks();
  const rules = await readRules();
  
  return links.map(link => ({
    ...link,
    rules: rules.filter(r => r.link_id === link.id)
  }));
}
