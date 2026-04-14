# BPTPIA Admin Dashboard

A professional, high-performance administrative panel for the **Bihar Private Technical & Professional Institutions Association (BPTPIA)**. Built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**.

---

## 🏗️ Clean Modular Architecture

This project follows a **Feature-Based Architecture** to ensure maximum scalability, logic isolation, and maintainability.

### 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router (Routing & Group Layouts)
│   └── (dashboard)/      # Protected dashboard route group
├── features/             # Business Features (Modular & Isolated)
│   └── [feature-name]/   # Contains its own:
│       ├── components/   # Feature-specific UI
│       ├── hooks/        # State & data management
│       ├── services/     # API interaction logic
│       └── types.ts      # TypeScript definitions
├── shared/               # Global cross-cutting concerns
│   ├── api/              # Centralized API Client & Endpoints
│   ├── components/       # Reusable layout & UI Boilerplate
│   └── utils/            # Shared helper functions
```

---

## 💎 Premium UI & UX Standards

The dashboard is designed to provide a "Desktop App" experience with high-end aesthetic standards:

- **Architecture**: **Non-paginated Scrolling**. All data tables use high-performance internal scrolling to show full lists without page reloads.
- **Formatting**: **Auto-Title Case**. All name fields in the Master module automatically format input (e.g., "patna" → "Patna") in real-time.
- **Aesthetics**: 
    - **Unified Scrollbars**: Sleek, custom-themed scrollbars are applied globally via `globals.css`.
    - **Action Feedback**: Optimized color-coding (**Red for Delete**, **Blue for Edit**) for intuitive interactions.
    - **Glassmorphism**: Subtle backdrop-blurs and gradients used in modals and headers.

---

## 🚀 Data & Service Layer

We use a robust, type-safe communication strategy:

### 1. Centralized API Client (`src/shared/api`)
Handles base URL prefixing, JSON headers, and global error logging automatically.

### 2. Feature Services
Each module (News, Gov-Letters, Master) has its own service layer, abstracting API complexity away from the UI.

```typescript
// Example: Master Module Service
const states = await masterService.getStates();
```

---

## 🛠️ Getting Started

### 1. Environment Configuration
Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. Installation & Development
```bash
npm install
npm run dev
```

---

## 📝 Coding Standards
- **Feature Isolation**: Never put feature-specific logic in the `shared` folder.
- **Strict Typing**: No `any` types; always define interfaces in the feature's `types.ts`.
- **Naming**: `PascalCase` for Components, `camelCase` for hooks and services.
