# 🚀 BPTPIA Admin Dashboard

Welcome to the **Bihar Private Technical & Professional Institutions Association (BPTPIA)** Admin Panel. This is a high-performance, professional-grade dashboard designed for managing institutional data, leads, news, and official correspondence.

---

## 🛠️ Tech Stack

Built with the latest cutting-edge technologies for speed and scalability:

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🎨 Typography & Design

We use a premium, modern typography system to ensure maximum readability and a sleek aesthetic.

- **Primary Font**: **[Geist Sans](https://vercel.com/font/sans)** (Main body and UI elements)
- **Monospace Font**: **[Geist Mono](https://vercel.com/font/mono)** (Codes, IDs, and numeric data)

### Default Tag Styling:
| Tag | Usage | styling details |
| :--- | :--- | :--- |
| **`h1`** | Page Titles | `3xl`, Light weight, Cyan-Blue, Wide tracking |
| **`h2`** | Modal Headers | `20px`, Semi-bold, Slate-800 |
| **`h3`** | Section Headers | `13px`, Bold, Uppercase, Primary Blue/Green |
| **`p`** | Body Text | `sm` (14px), Slate-600, Regular weight |
| **`label`** | Form Labels | `11px`, Bold, Uppercase, Muted Slate |
| **`span`** | Metadata/Chips | `10px`, Bold, Tracking-widest |

---

## 📂 Project Structure

We follow a **Feature-Based Architecture**, which makes the code easy to maintain and scale.

```text
root/
├── public/                 # Static assets (images, icons, etc.)
├── src/
│   ├── app/                # 🌐 Routing & Layouts (Next.js App Router)
│   │   ├── (dashboard)/    # Protected dashboard routes
│   │   ├── globals.css     # Global styles & Tailwind imports
│   │   └── layout.tsx      # Root layout
│   │
│   ├── features/           # 📦 Business Modules (Feature-specific logic)
│   │   ├── gov-letters/    # Official government letters management
│   │   ├── leads/          # Student leads & inquiries
│   │   ├── master/         # Master data (States, Cities, Institutions)
│   │   ├── media-gallery/  # Image and video gallery management
│   │   └── news/           # News and announcements
│   │       │
│   │       ├── components/ # UI components specific to this feature
│   │       ├── hooks/      # Custom React hooks for logic
│   │       ├── services/   # API calls specific to this feature
│   │       └── types.ts    # TypeScript definitions
│   │
│   └── shared/             # ♻️ Reusable Global Code
│       ├── api/            # Centralized API client (Axios/Fetch setup)
│       ├── components/     # UI Boilerplate (Buttons, Modals, Cards)
│       └── utils/          # Helper functions (Formatting, Validation)
│
├── .env.local              # Local environment variables (API URLs)
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

---

## 📖 Key Folder Explanations

### 1. `src/app`
Think of this as the **Map** of your website. Each folder inside `app` represents a URL path.
- **`(dashboard)`**: A "Route Group" used to organize all protected admin pages together without adding `/dashboard` to the URL.

### 2. `src/features`
This is the **Heart** of the application. Instead of putting all components in one big folder, we group them by what they *do*.
- **`services/`**: Files that talk to the backend server.
- **`hooks/`**: Special React functions that handle "state" or logic.
- **`types.ts`**: Tells TypeScript exactly what your data looks like (e.g., what fields a "Lead" has).

### 3. `src/shared`
This is the **Toolbox**. If you have a button or a date formatter that is used in *multiple* features, it belongs here.

---

## 💎 Features & Standards

- **Clean UI**: Dark/Light mode support with a premium, sleek aesthetic.
- **Real-time Formatting**: Names are automatically converted to Title Case (e.g., "patna" → "Patna").
- **Fast Performance**: Uses Next.js optimized rendering and zero-pagination scrolling for a smooth "Desktop App" feel.
- **Type Safety**: Fully typed with TypeScript to catch bugs before they happen.

---

## 🚀 Getting Started

### 1. Setup Environment
Create a `.env.local` file in the root and add your backend API URL:
```bash
NEXT_PUBLIC_API_URL=https://your-api-link.com/api
```

### 2. Install & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📏 Coding Guidelines

- **Keep it Modular**: If you are working on "News", all news-related logic should stay inside `features/news`.
- **No 'any'**: Always define types in `types.ts` to keep the code reliable.
- **Naming**: 
  - Components: `PascalCase.tsx`
  - Everything else: `camelCase.ts`
