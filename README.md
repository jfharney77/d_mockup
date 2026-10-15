# Dell Support Mockup

Interactive HTML mockups of the Dell Support website, built from Claude Design prototypes.

## Pages

### 1. Support Assistant Landing Page (`index.html`)

A dark-themed landing page matching the Dell UK support site design.

**Features:**
- AI-powered search box with character counter (0/200), mic button, and gradient submit button
- Quick action pills: Troubleshoot an issue, Find a driver, Diagnose my system
- Product card displaying XPS 16 9640 details (service tag, warranty status)
- Tabbed section: Recently Viewed / Find Products / My Products
- Recently viewed product cards with close/dismiss functionality
- Floating Virtual Assistant button (bottom-right) that opens a chat panel

**Virtual Assistant Chat Panel:**
- Gradient header with menu, expand, and close controls
- Conversation view with user/bot message bubbles
- Thumbs up/down feedback on bot responses
- Sign-in prompt card
- Text input with voice and send buttons
- Functional send — type a message and get a response

### 2. Product Support Page (`webpage_layout/index.html`)

A full product support page with sidebar navigation and multiple content sections.

**Sections:**
- **Overview** — Summary cards + tabbed content (Troubleshooting, Popular Solutions, Search Solutions) with animated tab indicator
- **Drivers & Downloads** — Automatic driver updates and additional resources
- **Diagnostics** — Hardware scan and system optimization tools
- **Service Requests** — Request look-up and management
- **Parts & Repairs** — Parts ordering interface

**Navigation:**
- Sticky left sidebar with active state highlighting
- Clicking a section scrolls to top and swaps content
- Tab switching within Overview animates the indicator bar

## Quick Start

No build step required. Open either page directly in a browser:

```bash
# Landing page
start index.html

# Product support page
start webpage_layout/index.html
```

## Tech Stack

- Pure HTML / CSS / JS (no frameworks, no build tools)
- Google Fonts: Manrope, Public Sans
- All assets are local PNG screenshots

## Source Designs

The `.dc.html` files are the original Claude Design exports used as design specifications. They require the dc-runtime (`support.js`) to render and are kept for reference only. The built `index.html` pages are standalone and independent of the dc-runtime.
