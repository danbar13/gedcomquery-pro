# GedcomQuery Pro 🌳

> **Privacy-First Client-Side Genealogy Workstation (SPA / PWA)**  
> Import, parse, search, analyze, enrich with Google Search Grounding, edit, and re-export GEDCOM (`.ged`) files directly in the browser.

## 🌟 Key Features

- **100% Client-Side Privacy (Local-First):** Zero server uploads. All GEDCOM parsing, bi-directional relationship graph traversal, and IndexedDB caching happen strictly in the browser.
- **Bi-Directional Graph & O(1) Kinship Calculator:** Traverse genealogical degrees of separation and consanguinity titles in both Hebrew and English (*סבא מצד האב / Paternal Grandfather*, *רעיה / Wife*, *נכדה / Granddaughter*, etc.).
- **Data Quality & Anomaly Detection:** Automated validation rules (implausible lifespan > 115, parent born after child, parent too young < 13 or too old > 70, death before birth, missing dates).
- **Interactive Lineage & Pedigree Tree:** Generational ancestral and descendant exploration.
- **Full Hebrew & English Localization (RTL / LTR):** Designed natively in Hebrew with one-click language switching (🇮🇱 / 🇺🇸).
- **Mobile Responsive & PWA Friendly:** Optimized layout, mobile bottom navigation bar, and off-canvas drawer for iOS Safari and Android Chrome.
- **Web Discovery & AI Grounding:** Research candidates using Gemini API with Google Search grounding.
- **GEDCOM Serializer & Full Export:** Export updated trees back to standard GEDCOM 5.5.1 UTF-8, CSV, JSON, and AI biography prompts.

## 🛠️ Tech Stack

- **Framework:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide Icons
- **Storage:** IndexedDB + LocalStorage (Local-First)
- **Deployment:** Vercel

## 🚀 Development & Build

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Type check & Production build
npm run build
```
