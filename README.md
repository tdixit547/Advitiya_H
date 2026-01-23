# Smart Link Hub - Strict Implementation

A production-ready, accessible React + Tailwind web application for managing smart links.

## 🚀 Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    npm start
    ```

## 🎨 Design System & Tokens
strictly enforced in `src/app/globals.css`.

-   **Background**: `#000000` (Strict Black)
-   **Accent Green**: `#00C853` (Material Green A700)
-   **Text**: `#E6E6E6` (Primary), `#9A9A9A` (Secondary)
-   **Focus Ring**: `rgba(0, 200, 83, 0.35)`

To modify tokens, edit the `:root` variables in `src/app/globals.css`.

## ♿ Accessibility Checklist (Automated Report Summary)

-   [x] **Contrast Ratios**: All text meets AA (4.5:1) or AAA (7:1) standards against black backgrounds.
-   [x] **Keyboard Navigation**:
    -   All interactive elements (`<button>`, `<input>`, `<a>`) have visible focus states.
    -   Drag-and-drop is keyboard accessible (Enter to pick up, Arrows to move, Enter to drop) via `@dnd-kit/sortable`.
-   [x] **ARIA Labels**:
    -   Icons and icon-only buttons have `aria-label`.
    -   Charts include `role="img"` and description.
-   [x] **Semantic HTML**: Uses `<main>`, `<nav>`, `<aside>`, `<h1>`-`<h6>` hierarchy.

## 🛠 Project Structure

-   `src/app/dashboard`: Main management interface (3-column layout).
-   `src/app/[slug]`: Public hub view (Server Component).
-   `src/components`:
    -   `AnalyticsPanel`: Visual charts using Recharts.
    -   `LinkListReorder`: Accessible DnD list.
    -   `RuleConfigurator`: Logic builder for smart links.
    -   `SettingsPanel`: Theme and export controls.
-   `src/lib/storage.ts`: JSON-based persistence layer.

## 📝 What I Changed (Summary)

From the initial prototype to this strictly compliant version:

1.  **Strict UI Tokens**: Enforced pure black (`#000000`) and the specific green accent (`#00C853`) throughout the app, replacing generic hex codes.
2.  **Layout Architecture**: Implemented the requested 3-column desktop layout for the dashboard (Navigation | Content | Analytics).
3.  **Advanced Components**:
    -   Added **Analytics Panel** with real time-series charts (`recharts`).
    -   Added **Drag-and-Drop** reordering (`dnd-kit`) with keyboard support.
    -   Added **Onboarding Modal** for first-time user guidance.
4.  **Accessibility**: Added proper ARIA attributes, focus rings, and high-contrast text colors.
5.  **Tech Stack Alignment**: Ensured Tailwind CSS v4 usage and React 19 compatibility.

## 📡 API Integration

The project currently uses a file-based JSON storage (`src/lib/storage.ts`) for demonstration. To connect to a real backend:

1.  Replace `storage.ts` logic with database queries (e.g., Prisma + PostgreSQL).
2.  Update `src/app/api/links` and `src/app/api/rules` to query the DB.
