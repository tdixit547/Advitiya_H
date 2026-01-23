# Sankey & Network Graph Analytics - Frontend Integration Guide

> **Purpose**: This guide provides all the information needed to build frontend components for the new Sankey diagram and Network graph analytics features.

---

## Quick Overview

The backend now supports **user flow visualization** via two new API endpoints:

| Feature | Endpoint | Purpose |
|---------|----------|---------|
| **Sankey Diagram** | `GET /api/admin/hubs/:hub_id/analytics/sankey` | Visualize user flow: Source → Link → Destination |
| **Network Graph** | `GET /api/admin/hubs/:hub_id/analytics/network` | Visualize connections between traffic sources and links |

---

## Authentication Required

All analytics endpoints require:
```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}
```

---

## Endpoint 1: Sankey Diagram Data

### Request
```http
GET /api/admin/hubs/:hub_id/analytics/sankey
GET /api/admin/hubs/:hub_id/analytics/sankey?start_date=2024-01-01&end_date=2024-01-31
```

### Query Parameters (Optional)
| Parameter | Type | Description |
|-----------|------|-------------|
| `start_date` | ISO string | Filter events from this date |
| `end_date` | ISO string | Filter events until this date |

### Response Structure
```typescript
interface SankeyResponse {
  nodes: Array<{
    id: string;       // Unique identifier
    label: string;    // Display name (e.g., "Google", "YouTube Link")
    type: 'source' | 'link' | 'destination';
  }>;
  links: Array<{
    source: string;   // Source node ID
    target: string;   // Target node ID
    value: number;    // Flow thickness (user count)
  }>;
  period: {
    start: string;    // ISO date
    end: string;      // ISO date
  };
}
```

### Example Response
```json
{
  "nodes": [
    { "id": "google.com", "label": "Google", "type": "source" },
    { "id": "direct", "label": "Direct", "type": "source" },
    { "id": "variant-youtube", "label": "youtube.com", "type": "link" },
    { "id": "variant-instagram", "label": "instagram.com", "type": "link" },
    { "id": "dest_youtube.com", "label": "youtube.com", "type": "destination" }
  ],
  "links": [
    { "source": "google.com", "target": "variant-youtube", "value": 150 },
    { "source": "direct", "target": "variant-youtube", "value": 80 },
    { "source": "direct", "target": "variant-instagram", "value": 30 },
    { "source": "variant-youtube", "target": "dest_youtube.com", "value": 230 }
  ],
  "period": {
    "start": "2024-01-01T00:00:00.000Z",
    "end": "2024-01-24T23:59:59.000Z"
  }
}
```

### Visualization Meaning
```
Google (150) ──────────────▶ YouTube Link (230) ──────────────▶ youtube.com
                    ▲
Direct (80) ────────┘

Direct (30) ───────────────▶ Instagram Link (30) ───────────▶ instagram.com
```

- **Thick lines** = More users took that path
- **Sources** = Where traffic came from (Google, Direct, Twitter, etc.)
- **Links** = Your smart link variants
- **Destinations** = Where users ended up

---

## Endpoint 2: Network Graph Data

### Request
```http
GET /api/admin/hubs/:hub_id/analytics/network
GET /api/admin/hubs/:hub_id/analytics/network?start_date=2024-01-01&end_date=2024-01-31
```

### Response Structure
```typescript
interface NetworkResponse {
  nodes: Array<{
    id: string;       // Unique identifier
    label: string;    // Display name
    weight: number;   // Total interactions (for sizing nodes)
    type: 'source' | 'link' | 'destination';
  }>;
  edges: Array<{
    source: string;   // From node ID
    target: string;   // To node ID
    weight: number;   // Connection strength
  }>;
}
```

### Example Response
```json
{
  "nodes": [
    { "id": "direct", "label": "Direct", "weight": 500, "type": "source" },
    { "id": "google.com", "label": "Google", "weight": 300, "type": "source" },
    { "id": "twitter.com", "label": "Twitter", "weight": 50, "type": "source" },
    { "id": "variant-001", "label": "youtube.com", "weight": 800, "type": "link" },
    { "id": "variant-002", "label": "instagram.com", "weight": 50, "type": "link" }
  ],
  "edges": [
    { "source": "direct", "target": "variant-001", "weight": 500 },
    { "source": "google.com", "target": "variant-001", "weight": 300 },
    { "source": "twitter.com", "target": "variant-002", "weight": 50 }
  ]
}
```

### Visualization Meaning
- **Node size** = Based on `weight` (more interactions = bigger node)
- **Edge thickness** = Based on `weight` (more transitions = thicker line)
- Great for seeing **which sources drive traffic to which links**

---

## Recommended Libraries

### For Sankey Diagrams
```bash
npm install d3-sankey
# OR
npm install recharts  # Has SankeyChart component
# OR
npm install @nivo/sankey
```

### For Network Graphs
```bash
npm install react-force-graph
# OR
npm install @nivo/network
# OR
npm install vis-network
```

---

## Frontend Implementation Examples

### React + D3 Sankey Example
```jsx
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

function SankeyChart({ data }) {
  const { nodes, links } = sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[0, 0], [width, height]])({
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d }))
    });

  return (
    <svg>
      {links.map((link, i) => (
        <path
          key={i}
          d={sankeyLinkHorizontal()(link)}
          fill="none"
          stroke="#aaa"
          strokeWidth={Math.max(1, link.width)}
          strokeOpacity={0.5}
        />
      ))}
      {nodes.map((node, i) => (
        <rect
          key={i}
          x={node.x0}
          y={node.y0}
          width={node.x1 - node.x0}
          height={node.y1 - node.y0}
          fill={getColorByType(node.type)}
        />
      ))}
    </svg>
  );
}
```

### React + Force Graph Network Example
```jsx
import ForceGraph2D from 'react-force-graph-2d';

function NetworkGraph({ data }) {
  const graphData = {
    nodes: data.nodes.map(n => ({
      id: n.id,
      name: n.label,
      val: n.weight,  // Node size
      color: getColorByType(n.type)
    })),
    links: data.edges.map(e => ({
      source: e.source,
      target: e.target,
      value: e.weight  // Link thickness
    }))
  };

  return (
    <ForceGraph2D
      graphData={graphData}
      nodeLabel="name"
      nodeVal="val"
      linkWidth={link => Math.sqrt(link.value) / 10}
    />
  );
}
```

---

## API Fetch Helper

```javascript
const API_BASE = 'http://localhost:3000';

async function fetchSankeyData(hubId, startDate, endDate) {
  const token = localStorage.getItem('auth_token');
  
  let url = `${API_BASE}/api/admin/hubs/${hubId}/analytics/sankey`;
  if (startDate || endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    url += `?${params}`;
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) throw new Error('Failed to fetch Sankey data');
  return response.json();
}

async function fetchNetworkData(hubId, startDate, endDate) {
  const token = localStorage.getItem('auth_token');
  
  let url = `${API_BASE}/api/admin/hubs/${hubId}/analytics/network`;
  if (startDate || endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    url += `?${params}`;
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) throw new Error('Failed to fetch Network data');
  return response.json();
}
```

---

## UI Components to Build

### 1. Analytics Dashboard Section
Add a new tab/section in the hub dashboard for "Flow Analytics" with:
- Date range picker (start_date, end_date)
- Toggle between Sankey and Network view
- The actual visualization

### 2. Sankey Diagram Component
```
┌─────────────────────────────────────────────────────────────┐
│  User Flow Analysis                    [Last 7 days ▼]      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Google ━━━━━━━━━━━━▶ YouTube Link ━━━━━━━━━━▶ youtube.com  │
│  Direct ━━━━━━━━━▶                                          │
│                                                              │
│  Twitter ━━▶ Instagram Link ━━▶ instagram.com               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3. Network Graph Component
```
┌─────────────────────────────────────────────────────────────┐
│  Traffic Network                       [Last 7 days ▼]      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│        ◉ Google                                              │
│          \                                                   │
│           \────────────▶ ◉ YouTube Link                     │
│           /                                                  │
│        ◉ Direct                                              │
│                                                              │
│        ◉ Twitter ──────▶ ◉ Instagram Link                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Color Scheme Suggestion

| Node Type | Color | Meaning |
|-----------|-------|---------|
| `source` | `#3B82F6` (Blue) | Traffic sources |
| `link` | `#10B981` (Green) | Your smart links |
| `destination` | `#8B5CF6` (Purple) | Final destinations |

---

## Error Handling

```javascript
try {
  const data = await fetchSankeyData(hubId);
  if (data.nodes.length === 0) {
    showEmptyState("No flow data yet. Share your links to see traffic!");
  }
} catch (error) {
  if (error.message.includes('401')) {
    redirectToLogin();
  } else {
    showError("Failed to load analytics");
  }
}
```

---

## Testing

To test with sample data, you can:
1. Create a hub with variants
2. Visit the short link (`/:slug`) with different `Referer` headers
3. Check the analytics endpoints

```bash
# Simulate traffic from Google
curl -H "Referer: https://google.com" http://localhost:3000/your-slug

# Simulate direct traffic
curl http://localhost:3000/your-slug
```

---

## Questions?

The backend developer can be reached for clarification. The endpoints are live on:
- Branch: `lakshya`
- Repository: `https://github.com/tdixit547/Advitiya_H`
