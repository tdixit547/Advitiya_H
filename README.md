# Smart Link Hub

**An intelligent link management platform with context-aware routing, real-time analytics, and a customizable public profile — built as a modern alternative to Linktree.**

Smart Link Hub goes beyond static link-in-bio pages. It evaluates incoming traffic against a configurable decision tree and dynamically routes visitors to the most relevant destination based on their device, geographic location, and time of access.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [License](#license)

---

## Features

### Smart Routing Engine

The core differentiator. Instead of showing every visitor the same list of links, Smart Link Hub evaluates a decision tree of rules to determine which links are most relevant:

- **Device Targeting** — Route iOS users to the App Store and Android users to the Play Store from a single link.
- **Geolocation Targeting** — Direct visitors to region-specific pages (e.g., `.com` for US traffic, `.in` for India).
- **Time-Based Routing** — Schedule links to be active only during specific time windows, days of the week, or recurring intervals.
- **Priority and Weight System** — Control which variants surface first using configurable priority levels and weight-based distribution.

### Real-Time Analytics Dashboard

Every interaction is tracked and aggregated into actionable metrics:

- **Performance Metrics** — Clicks, impressions, and click-through rate (CTR) per variant.
- **Geographic Distribution** — Visualize traffic origin by country.
- **Device and OS Breakdown** — Understand the technology profile of your audience.
- **Time Series Analysis** — Monitor traffic trends across configurable time ranges.
- **Engagement Tracking** — Detect user behavior patterns including rage clicks and scroll depth.

### Hub Management

- **Custom Public Profiles** — Each hub is a public landing page at a clean URL (`/your-slug`).
- **Multi-Hub Support** — Manage multiple brands, campaigns, or projects from one account.
- **Live Editing** — Update slugs, default URLs, themes, and variant configurations in real time.
- **Variant Conditions** — Attach device, country, and time-window conditions directly to link variants.

### QR Code Generation

- **Client-Side Generation** — QR codes are generated locally using the `qrcode` library, with no external API dependency.
- **Multiple Formats** — Download as high-resolution PNG or scalable SVG.
- **Theme Support** — Toggle between light and dark QR backgrounds.
- **Smart Linking** — QR codes automatically point to the shortest available URL (external short URL > internal short code > full URL).

### URL Shortening

- **External Provider Integration** — Generate short URLs via TinyURL or da.gd through a dedicated Python microservice.
- **Provider Fallback** — If the selected provider fails, the system automatically falls back to TinyURL.
- **Service Health Monitoring** — The frontend checks shortener availability before exposing the feature.

### Rule Tree Builder

- **Visual Editor** — Build complex routing logic through an interactive, nested decision tree interface.
- **Node Types** — Device, Location, and Time-based branching with configurable leaf nodes.
- **Interactive Map Selector** — Select target countries using a Leaflet-powered world map.
- **Cache Management** — Rule trees are cached in Redis for sub-millisecond resolution. Cache can be manually invalidated from the UI.

---

## Architecture

The application follows a **monorepo** structure with three independently deployable services:

```
smart-link-hub/
├── apps/
│   ├── frontend/       Next.js 16 — Dashboard, public hub pages, analytics UI
│   ├── backend/        Express.js — REST API, decision engine, analytics aggregation
│   └── shortener/      Flask — URL shortening microservice (Python)
├── package.json        Workspace root with concurrently-managed dev scripts
└── schema.sql          Reference PostgreSQL schema (production uses MongoDB)
```

### Data Flow

```
Visitor → GET /:slug → Backend resolves hub + decision tree
                      → Evaluates visitor context (device, country, time)
                      → Returns filtered and ranked link variants
                      → Frontend renders public profile

Click → POST /api/analytics/click → Event logged to Redis stream
                                   → Stats aggregator updates VariantStats
                                   → Dashboard reflects updated metrics
```

---

## Technology Stack

### Frontend

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | React Hooks, Context API |
| Charts | Recharts |
| Maps | Leaflet, React-Leaflet |
| QR Codes | qrcode (client-side) |
| Drag & Drop | dnd-kit |

### Backend

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Language | TypeScript |
| Database | MongoDB (Mongoose ODM) |
| Cache | Redis (ioredis) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Validation | Zod |
| User Agent Parsing | ua-parser-js |
| Rate Limiting | express-rate-limit |
| Testing | Jest, Supertest, mongodb-memory-server |

### URL Shortener Microservice

| Component | Technology |
|-----------|-----------|
| Language | Python |
| Framework | Flask |
| Library | pyshorteners |
| Providers | TinyURL, da.gd, is.gd, clck.ru |

---

## Getting Started

### Prerequisites

- Node.js v18 or later
- MongoDB (local instance or connection URI)
- Redis (recommended for caching; the application functions without it)
- Python 3.8+ (only required for the URL shortener microservice)

### 1. Clone the Repository

```bash
git clone https://github.com/tdixit547/Advitiya_H.git
cd Advitiya_H
```

### 2. Install Dependencies

```bash
# Root workspace dependencies
npm install

# Shortener microservice (optional)
cd apps/shortener
pip install flask flask-cors pyshorteners
cd ../..
```

### 3. Configure Environment Variables

Create `.env` in `apps/backend/`:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/smart-link-hub
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

Create `.env.local` in `apps/frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Start the Application

```bash
# Start all services concurrently
npm run dev

# Or start individually:
npm run dev:backend      # Express API on :3001
npm run dev:frontend     # Next.js on :3000
cd apps/shortener && python app.py   # Flask on :5000
```

### 5. Seed Sample Data (Optional)

```bash
npm run seed
```

---

## Project Structure

### Backend (`apps/backend/src/`)

```
routes/
  admin.ts          Hub, variant, rule tree, and stats CRUD endpoints
  auth.ts           Registration, login, token verification
  analytics.ts      Click tracking, hub overview, performance data

services/
  AuthService.ts                  User registration, login, JWT handling
  CacheService.ts                 Redis-backed rule tree and stats caching
  DecisionTreeEngine.ts           Core routing engine — evaluates visitor context
  AnalyticsAggregationService.ts  Stats computation, CTR, performance classification
  ShortenerService.ts             Integration with the Python shortener microservice

models/
  User.ts           User accounts
  LinkHub.ts        Hub configuration and metadata
  Variant.ts        Link variants with conditions
  RuleTree.ts       Decision tree structure (device/location/time nodes)
  VariantStats.ts   Aggregated click and impression statistics
  Event.ts          Raw analytics events

middleware/
  authMiddleware.ts   JWT verification, hub ownership checks
  rateLimiter.ts      Rate limiting for auth and API endpoints

workers/
  StatsAggregator.ts  Background worker for processing Redis event streams
```

### Frontend (`apps/frontend/src/`)

```
app/
  [slug]/page.tsx                  Public hub profile page
  login/page.tsx                   Authentication
  register/page.tsx                Account creation
  dashboard/page.tsx               Main dashboard overview
  dashboard/links/page.tsx         Link variant management
  dashboard/rules/page.tsx         Rule tree configuration
  dashboard/conversions/page.tsx   Conversion analytics
  dashboard/referrals/page.tsx     Referral analytics
  dashboard/engagement/page.tsx    Engagement analytics
  analysis/[hubId]/page.tsx        Deep analytics view
  hub/[hubId]/tools/page.tsx       QR codes, URL shortening, sharing
  hub/[hubId]/qr/page.tsx          QR code customization

components/
  AnalyticsPanel.tsx      KPI cards with animated counters and trend charts
  VariantList.tsx         Sortable list of link variants with inline stats
  VariantEditor.tsx       Create/edit form with condition builder
  RuleTreeBuilder.tsx     Visual decision tree editor
  WorldMapSelector.tsx    Interactive country selection via Leaflet map
  LinkButton.tsx          Public-facing link button with click tracking

lib/
  api-client.ts           Centralized API client with auth, error handling, rate limit support
```

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Authenticate and receive JWT |
| GET | `/api/auth/me` | Get current user profile |
| GET | `/api/auth/verify` | Validate token |

### Hub Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/hubs` | List all hubs for authenticated user |
| POST | `/api/admin/hubs` | Create a new hub |
| GET | `/api/admin/hubs/:hub_id` | Get hub details |
| PUT | `/api/admin/hubs/:hub_id` | Update hub configuration |
| DELETE | `/api/admin/hubs/:hub_id` | Delete a hub and all associated data |

### Variant Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/hubs/:hub_id/variants` | List variants for a hub |
| POST | `/api/admin/hubs/:hub_id/variants` | Create a new variant |
| PUT | `/api/admin/hubs/:hub_id/variants/:variant_id` | Update variant |
| DELETE | `/api/admin/hubs/:hub_id/variants/:variant_id` | Delete variant |

### Rule Tree

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/hubs/:hub_id/tree` | Get the decision tree |
| PUT | `/api/admin/hubs/:hub_id/tree` | Create or update the decision tree |
| POST | `/api/admin/hubs/:hub_id/tree/invalidate` | Invalidate cached tree |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/hubs/:hub_id/stats` | Aggregated hub statistics |
| POST | `/api/admin/hubs/:hub_id/stats/aggregate` | Force stats recalculation |
| POST | `/api/analytics/click` | Record a click event |
| GET | `/api/analytics/hub/:hub_id/overview` | Hub performance overview |
| GET | `/api/analytics/hub/:hub_id/links` | Per-link performance data |

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:slug` | Resolve hub and return filtered links |

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

*Built for the Advitiya 2026 Hackathon.*
