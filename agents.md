# Agents & Tools Used

## Workflow

This project was built using a two-agent pipeline:

### 1. Claude Design (UI Design Agent)

**Role:** Visual design exploration and prototyping

Claude Design generated multiple UI variants as `.dc.html` files — self-contained design components that render via the dc-runtime (`support.js`). These files served as the design specification.

**Outputs:**
- `Support Assistant.dc.html` — Three landing page variants:
  - **1a** — Dark hero with gradient search box (selected for build)
  - **1b** — Light theme with serif headline and pill-shaped inputs
  - **1c** — Split layout with prompt left, task tiles right
- `Virtual Assistant.dc.html` — Chat panel with gradient header, message bubbles, thumbs up/down feedback, sign-in prompt, and input bar
- `Product Page.dc.html` — Full product support page with sidebar navigation, tabbed content sections (Overview, Drivers & Downloads, Diagnostics, Service Requests, Parts & Repairs)

**Reference material provided to Claude Design:**
- Screenshots of the live Dell UK support site (`dellsupportUK1.png`, `dellsupportUK2.png`, `dellsupportUKshort2.png`)
- Screenshots of various product page sections (17 screenshots covering sidebar, banners, tabs, and content areas)

### 2. Claude Code (Implementation Agent)

**Role:** Convert Claude Design outputs into production-ready standalone HTML pages

Claude Code read the `.dc.html` design specs and reference screenshots, then built functional HTML/CSS/JS pages that:
- Reproduce the visual design without the dc-runtime dependency
- Add real interactivity (character counters, tab switching, chat messaging, sidebar navigation)
- Use real product data extracted from the reference screenshots
- Work as standalone files openable directly in a browser

**Implementation details:**

| Page | Source Design | Key Features |
|------|-------------|--------------|
| `index.html` | `Support Assistant.dc.html` (1a) + `Virtual Assistant.dc.html` | Dark hero landing, AI prompt box, quick action pills, product card, recently viewed cards, floating VA chat panel |
| `webpage_layout/index.html` | `Product Page.dc.html` | Sidebar navigation with active state, 5 content views, animated tab indicator, screenshot-based sections with overlay buttons |

## Agent Interaction Pattern

```
┌─────────────────┐     .dc.html files      ┌──────────────┐
│  Claude Design   │ ──────────────────────► │  Claude Code  │
│  (UI prototyping)│     + screenshots       │  (build HTML) │
└─────────────────┘                          └──────────────┘
        ▲                                           │
        │                                           ▼
   User provides                              Standalone
   reference screenshots                     index.html files
   & design direction                         opened in browser
```

No iteration loop was needed between agents — Claude Design produced the specs, Claude Code built from them in a single pass per page.
