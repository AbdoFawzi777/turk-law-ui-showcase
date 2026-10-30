# ⚖️ Turk Law & Mizan — Frontend UI & Design System Showcase

> **Modern Arabic-first (RTL/LTR), Dark/Light Mode Legal Practice Management Interface**  
> Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Radix UI**.

---

## 🌟 Overview

**Turk Law & Mizan UI Showcase** is an enterprise-grade user interface and design system crafted specifically for modern law firms, corporate legal departments, and judicial advocates in the Middle East and worldwide.

This repository serves as a **standalone Frontend Design & Component Showcase**. It highlights the UI architecture, visual layouts, responsive tables, modal workflows, and tabbed analytics systems without exposing backend business logic, database migrations, credentials, or proprietary payment gateway integrations.

---

## ✨ Key Features & Interface Highlights

### 1. 🇸🇦 Arabic-First RTL & LTR Architecture
- Engineered with native Right-to-Left (RTL) ergonomics tailored for Saudi Arabian and Gulf legal workflows (`dir="rtl"`).
- Dynamic locale toggling with instant bidirectional layout adaptation.
- Full support for Saudi currency formatting (`ر.س` / `SAR`) and localized legal identifiers.

### 2. 🌓 Adaptive Theme Engine (Dark & Light Mode)
- Built on OKLCH color spaces for smooth, high-contrast readability during lengthy legal review sessions.
- Seamless automatic detection of system dark/light preferences, with persistent user toggle.

### 3. 📂 Comprehensive Legal Management Screens & Tabs
- **Dashboard & Analytics:** Real-time KPI summary widgets, workload distribution charts, and hearing reminders.
- **Matters & Cases Register:** Sticky action columns (`عرض`, `تعديل`, `أرشفة`), health scoring (`مؤشر السلامة`), case-stage badges, and filtering.
- **Client Profiles:** Localized corporate and individual profiles, searchable regional seat registries, and company contact structures.
- **Weekly Operational Calendar:** High-density agenda and 7-day navigation synchronized to legal court sessions.
- **Legal Reports Center:** Comprehensive operational dashboards with multi-tab filters (Matters, Clients, Billing, Tasks) and export triggers.
- **Legal Contracts & Documents:** Document category chips, verification status indicators, and preview modal dialogs.
- **Payroll & Compensation:** Clean self-service payslip views and executive payroll summaries.

---

## 🛠️ Tech Stack

- **Framework:** React 19 (TypeScript)
- **Styling:** Tailwind CSS v4 + PostCSS
- **Component Primitives:** Radix UI (`@radix-ui/react-*`), Lucide Icons (`lucide-react`)
- **Calendar Engine:** FullCalendar (`@fullcalendar/react`)
- **Bundler:** Vite

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v20+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdoFawzi777/turk-law-ui-showcase.git
cd turk-law-ui-showcase

# Install dependencies
npm install

# Start local Vite development server
npm run dev
```

The interface will be accessible at `http://localhost:3000`.

---

## 🔒 Security & Decoupling Notice

This repository contains **strictly frontend interface, styling, and design components**. All proprietary server-side logic, database persistence layers, environment secrets, and payment processing adapters have been deliberately decoupled and excluded to preserve system integrity and confidentiality.

---

## 📄 License

Distributed under the **MIT License**. Created by [AbdoFawzi777](https://github.com/AbdoFawzi777).
