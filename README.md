# Hizu Frontend — وب‌سایت و پلتفرم ساخت دیجیتال هیزو

The Next.js 14 frontend for **Hizu — هیزو**, implementing an engineering-focused digital fabrication atelier and e-commerce experience.

---

## 🎨 Visual Identity & Design System

The visual design implements the **Botanical Specimen & Terra System** / **Modern Technical Neo-Brutalism** specification from `design.md`:
- **Canvas / Paper**: `#F7F5EE` / `#FCF9F1`
- **Primary Ink**: `#082719` / `#1F3D2E`
- **Secondary**: `#516536` / `#6B7F4E` (Moss green)
- **Accents**: `#EDE8DC` / `#dfc79b` (Warm Sand Tan), `#0284c7` (Engineering Blue)
- **Typography**: `Vazirmatn` (Persian primary), `Space Grotesk` (Technical display), `JetBrains Mono` (Coordinates, metrics, SKU codes).
- **Tactile Pop-up Cards**: `.card-popup` & `.card-popup-hover` with hairline borders and offset shadows.

---

## 🚀 Quick Start

### 1. Requirements
- Node.js 18+ or 20+
- npm

### 2. Configure Environment
Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build Production
```bash
npm run build
npm start
```
