# Smart Link Hub - Advitiya 2026

**A dynamic, intelligent Linktree clone built for the modern web.**

> "Individuals such as creators, educators, freelancers, startups, and small organizations often need to share multiple links using a single, simple URL. Existing solutions are largely static... There is a need for a system that goes beyond simple link aggregation and solves real usability and optimization problems."

**Smart Link Hub** solves this by replacing static lists with an **intelligent routing engine** that adapts content based on who is watching and when.

![Smart Link Hub](/public/screenshots/demo.png)

## 🚀 Key Features

### 🧠 Intelligent Routing
Unlike static pages, Smart Link Hub filters links in real-time based on visitor context:
- **⏰ Time-Based Rules**: Show "Join Meeting" links only during working hours (e.g., 9 AM - 5 PM).
- **📱 Device Detection**: Automatically show "App Store" to iOS users and "Play Store" to Android users.
- **🌍 Geo-Targeting**: Show "Amazon India" to visitors from India and "Amazon US" to visitors from the USA.

### 📈 Performance Optimization
- **Dynamic Sorting**: The system automatically bubbles up the most clicked links to the top.
- **Real-Time Analytics**: Built-in dashboard to track Views, Clicks, and CTR.

### 🎨 Strict Aesthetic
- **Theme**: Professional **Black (#000000)** background with **Neon Green (#00FF00)** accents.
- **responsive**: Perfect on Mobile and Desktop.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase / Neon / Vercel Postgres)
- **Deployment**: Vercel

## 🏁 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/smart-link-hub.git
cd smart-link-hub
npm install
```

### 2. Configure Environment
Rename `.env.example` to `.env` and add your PostgreSQL connection string:
```bash
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

### 3. Setup Database
Run the contents of `schema.sql` in your database SQL editor (e.g., Supabase SQL Editor) to create the required tables and seed initial data.

### 4. Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000` to see the home page.
Visit `http://localhost:3000/demo` to see the smart hub in action.
Visit `http://localhost:3000/dashboard` to access the admin panel.

## 📦 Deployment

This project is optimized for deployment on **Vercel**.

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Add the `DATABASE_URL` environment variable in Vercel Project Settings.
4. Redeploy.

## 🔧 Troubleshooting

**Hydration Warnings in Development:**
You might see warnings like `A tree hydrated but some attributes...`. This is often caused by browser extensions (like password managers or ad blockers) injecting code. It does not affect the production build.

## 📜 License

MIT © Advitiya 2026 Hackathon Team
