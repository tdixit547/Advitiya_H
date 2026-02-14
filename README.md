# Smart Link Hub

**Smart Link Hub** is an advanced, enterprise-grade link management platform designed to provide context-aware routing, real-time analytics, and customizable public profiles. It serves as a robust, self-hosted alternative to commercial link-in-bio services, offering granular control over traffic distribution based on user device, geolocation, and temporal factors.

## Overview

Smart Link Hub distinguishes itself with a decision-tree-based routing engine. Unlike static redirection services, it dynamically evaluates every incoming request against a configurable set of rules to determine the optimal destination URL. This capability allows for sophisticated traffic management strategies, such as directing mobile users to specific app stores, routing international traffic to regional domains, and scheduling time-sensitive campaigns.

## Features

### Intelligent Routing Engine
- **Device-Based Routing:** Automatically detects user device types (iOS, Android, Desktop) to serve platform-specific links.
- **Geographic Targeting:** Routes traffic based on the visitor's country of origin, enabling localized content delivery.
- **Temporal Scheduling:** Configures links to be active only during specific time windows, days of the week, or recurring intervals.
- **Weighted Distribution:** Supports probabilistic traffic splitting for A/B testing and load balancing.

### Comprehensive Analytics
- **Real-Time Metrics:** Tracks clicks, impressions, and Click-Through Rates (CTR) with immediate data reflection.
- **Audience Insights:** specialized visualization for geographic distribution, device types, and operating systems.
- **Traffic Trends:** Time-series analysis to monitor peak engagement periods.
- **Engagement Monitoring:** Tracks user interactions including scroll depth and "rage clicks" to identify UX bottlenecks.

### Hub Management System
- **Public Profiles:** Generates clean, branded landing pages (e.g., `/brand-name`).
- **Multi-Tenant Support:** Manages multiple hubs and campaigns from a single dashboard.
- **Visual Rule Editor:** Intuitive, drag-and-drop interface for building complex routing logic trees.
- **Live Configuration:** Updates to routing rules and profiles are applied instantly without deployment.

### Integrated Tools
- **QR Code Generator:** Client-side generation of high-resolution QR codes (PNG/SVG) with customizable styles.
- **URL Shortener:** Built-in microservice supporting multiple providers (TinyURL, Is.gd, Da.gd) with automatic failover.

## Architecture

The project is structured as a monorepo containing three primary services:

1.  **Frontend**: Built with **Next.js 16** (App Router), leveraging **Tailwind CSS v4** for styling and **Recharts** for analytics visualization. It interfaces with the backend REST API for all data operations.
2.  **Backend**: A **Node.js** and **Express** application acting as the core control plane. It handles authentication, decision tree evaluation, and data aggregation.
    -   **Database**: **MongoDB** utilizing Mongoose for object modeling.
    -   **Caching**: **Redis** is employed for caching compiled routing trees and high-velocity analytics writes.
3.  **Shortener Microservice**: A lightweight **Python (Flask)** service dedicated to interfacing with external URL shortening providers.

## Technology Stack

### Frontend Application
-   **Framework**: Next.js 16
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS v4
-   **State Management**: React Context & Hooks
-   **Visualization**: Recharts, React-Leaflet
-   **Utilities**: dnd-kit (Drag & Drop), qrcode

### Backend API
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Language**: TypeScript
-   **Database**: MongoDB
-   **Caching**: Redis
-   **Authentication**: JWT (JSON Web Tokens)
-   **Validation**: Zod

### Microservices
-   **URL Shortener**: Python 3.8+, Flask, Pyshorteners

## Getting Started

Follow these instructions to set up the Smart Link Hub development environment.

### Prerequisites

-   **Node.js**: v18.0.0 or higher
-   **MongoDB**: v5.0 or higher
-   **Redis**: v6.0 or higher
-   **Python**: v3.8 or higher (for the shortener service)

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/tdixit547/Advitiya_H.git
    cd Advitiya_H
    ```

2.  **Install Dependencies**

    ```bash
    # Install Node.js dependencies for frontend and backend
    npm install

    # Install Python dependencies for the shortener service
    cd apps/shortener
    pip install -r requirements.txt
    cd ../..
    ```

### Configuration

1.  **Backend Environment**
    Create a `.env` file in `apps/backend/`:

    ```env
    PORT=3001
    MONGODB_URI=mongodb://localhost:27017/smart-link-hub
    REDIS_HOST=localhost
    REDIS_PORT=6379
    JWT_SECRET=your_secure_random_string
    JWT_EXPIRES_IN=7d
    ```

2.  **Frontend Environment**
    Create a `.env.local` file in `apps/frontend/`:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```

### Running the Application

You can start the services individually or concurrently.

**Concurrent Start (Recommended for Development):**

```bash
npm run dev
```

**Individual Services:**

```bash
# Backend
npm run dev:backend

# Frontend
npm run dev:frontend

# Shortener Service
cd apps/shortener
python app.py
```

## API Reference

The backend exposes a RESTful API. Key endpoints include:

-   `POST /api/auth/login`: Authenticate user.
-   `GET /api/admin/hubs`: Retrieve managed hubs.
-   `GET /:slug`: Public endpoint to resolve routing rules and return appropriate links.
-   `POST /api/analytics/click`: Ingest click telemetry.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
