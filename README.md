# 🔗 Smart Link Hub - Advanced Link Management Platform

**Smart Link Hub** is a powerful, full-stack application designed to be the ultimate open-source alternative to Linktree, with advanced "Smart Routing" capabilities. It allows users to create personalized landing pages ("Hubs") and intelligently route visitors to specific destinations based on their device, location, or time of access.

![Smart Link Hub Dashboard](https://via.placeholder.com/800x400?text=Smart+Link+Hub+Dashboard)

## 🚀 Key Features

### 🧠 Smart Routing Engine
The core of the platform is its intelligent routing system. Instead of simple static links, Smart Link Hub evaluates incoming traffic against a decision tree of rules:
*   **📱 Device Targeting:** Automatically route iOS users to the App Store and Android users to the Play Store.
*   **🌍 Geolocation Targeting:** Send visitors to region-specific pages (e.g., US visitors to `.com`, Indian visitors to `.in`).
*   **⏰ Time-Based Routing:** Schedule active links for specific campaigns or time windows.

### 📊 Comprehensive Analytics
Gain deep insights into your audience with our real-time analytics dashboard:
*   **Performance Metrics:** Track Clicks, Impressions, and Click-Through Rates (CTR).
*   **Geographic Heatmaps:** Visualize where your traffic is coming from.
*   **Device & OS Breakdown:** Understand what technology your audience uses.
*   **Time Series Analysis:** View traffic trends over time (24h, 7 days, etc.).

### 📱 QR Code Generator (Enhanced)
*   **Instant Generation:** Create custom QR codes for any Hub.
*   **Profile Redirection:** QR codes now smartly redirect directly to your Hub Profile, ensuring users always see your latest links.
*   **High-Quality Downloads:** Download codes in **PNG** or **SVG** formats for print and digital use.
*   **Customization:** Fully customizable foreground and background colors to match your brand.

### 🛠️ Hub Management
*   **Custom URLs:** Choose your own unique slug (e.g., `/my-brand`).
*   **Theme Customization:** Personalize your Hub with custom background and accent colors.
*   **Live Editing:** Update your Hub's details (Slug, Default URL) instantly via the Dashboard.
*   **Multi-Hub Support:** Manage multiple brands or campaigns from a single account.

## 🏗️ Technology Stack

This project is built as a **Monorepo** using modern web technologies:

### **Frontend** (`apps/frontend`)
*   **Framework:** [Next.js 15+ (App Router)](https://nextjs.org/)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (v4)
*   **State Management:** React Hooks & Context
*   **Maps:** Leaflet (for visual country selection)
*   **QR Generation:** `qrcode` library (Client-side generation)

### **Backend** (`apps/backend`)
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Caching:** Redis (for high-performance rule resolution)
*   **Language:** TypeScript
*   **Authentication:** JWT (JSON Web Tokens)

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB (or a connection URI)
*   Redis (optional, but recommended for production performance)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/smart-link-hub.git
cd smart-link-hub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env` files in both `apps/frontend` and `apps/backend` based on the `.env.example` files provided.

**Backend (`apps/backend/.env`):**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/smart-link-hub
REDIS_HOST=localhost
JWT_SECRET=your_super_secret_key
# ...other configs
```

**Frontend (`apps/frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Seed Database (Optional)
Populate the database with sample data for testing analytics:
```bash
npm run seed
```

### 5. Run the Application
Start both frontend and backend concurrently:
```bash
npm run dev
```
*   **Frontend:** `http://localhost:3000`
*   **Backend:** `http://localhost:3001`

## 🧪 Testing & Verification

We have included several utility scripts to verify core functionalities:
*   `verify_fix.js`: Tests the proxy configuration for Short URLs.
*   `fetch_short_code.js`: Retrieves generated short codes from the database.
*   `verify_redirect.js`: Confirms that redirects are pointing to the correct destinations.

## 📝 Recent Updates (Changelog)

*   **Edit Hub Feature:** Added a modal to allow users to update their Hub's slug and default URL directly from the dashboard.
*   **QR Code Engine:** Migrated from an external API to a local library for faster, more reliable, and privacy-focused QR generation.
*   **Short URL Logic:** Updated the short URL behavior (`/r/:code`) to redirect users to the Hub Profile page instead of the fallback URL, providing a better user experience for QR code scans.
*   **Frontend-Backend Integration:** Fixed proxy issues to ensuring seamless routing between the Next.js frontend and Express backend.
*   **Country Selection Fix:** Resolved a bug where clearing country rules was not persisting to the database.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
*Built for the Advitiya 2026 Hackathon.*
