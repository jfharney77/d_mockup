# Dell Support Mockup Project

## Overview

Interactive HTML mockups of the Dell UK Support website. Designs are prototyped in
**Claude Design** (claude.ai/design), exported as zips, and then hand-integrated by
Claude Code into two standalone, screenshot-based HTML pages.

**The two pages that matter (the "built" pages):**

| Page | File | Built from |
|---|---|---|
| Support Assistant landing page | `index.html` | `Support Assistant.dc.html` |
| Product support page (XPS 16 9640) | `webpage_layout/index.html` | `webpage_layout/Product Page.dc.html` |

Both pages include the Virtual Assistant chat from `shared/va.css` + `shared/va.js`
(built from `Virtual Assistant.dc.html`). Everything else is source material,
reference, or archive.

Repository: https://github.com/jfharney77/d_mockup (branch `main`).

## Project Structure

```
dell_mockup/
├── index.html                  # BUILT: landing page (dark hero, search, This PC card)
├── Support Assistant.dc.html   # Claude Design source for the landing page
├── Virtual Assistant.dc.html   # Claude Design source for the chat drawer
├── support.js                  # dc-runtime for the .dc.html files (do not edit)
├── shared/va.css, shared/va.js # BUILT: Virtual Assistant button + chat drawer, used by BOTH pages
├── data/product.json           # Real product data for the landing page (git-ignored)
├── data/product.example.json   # Committed template with XXX values
├── serve.cmd                   # Starts a local server on :8000 (needed for the JSON)
├── claude_design_brief.md      # Context to paste into Claude Design when iterating
├── README.md, agents.md        # Public readme / how the pages were built
├── .gitignore                  # Keeps product.json, export zips and local settings out of git
├── latest.zip                  # Current Claude Design export (overwritten; git-ignored)
├── old_designs/                # Archive of export zips (git-ignored)
├── screenshots/                # ORIGINAL screenshots of dell.com — upload these to Claude Design
├── uploads/                    # Landing page images: reference screenshots, VA icon (mindellva.png)
├── .claude/skills/integrate-design/  # /integrate-design workflow for new exports
└── webpage_layout/
    ├── index.html              # BUILT: product page
    ├── Product Page.dc.html    # Claude Design source (latest export)
    ├── sidebar_clean.png       # Sidebar image (no baked-in highlight)
    ├── support.js              # dc-runtime (do not edit)
    └── uploads/                # Images as exported by Claude Design (what the page loads)
```

## How the Claude Design loop works

1. **Design** — The user works in Claude Design, uploading images from `screenshots/`
   and pasting `claude_design_brief.md` for context.
2. **Export** — The user exports the whole Claude Design project to **`latest.zip`**
   in the project root and overwrites it on each iteration. Claude Design does not
   write into the folder itself. The export is flat: all three `.dc.html` files,
   `support.js`, `.thumbnail`, a Claude Design `CLAUDE.md` (its copy of the brief,
   not ours: never copy it over this file) and one combined `uploads/`.
   Where each piece goes:
   - `Support Assistant.dc.html`, `Virtual Assistant.dc.html`, `.thumbnail` → project root
   - `Product Page.dc.html` → `webpage_layout/`
   - new images used by the landing page → `uploads/`; by the product page → `webpage_layout/uploads/`
3. **Archive** — Before integrating, copy `latest.zip` to `old_designs/latest_<date>.zip`
   (it gets overwritten next time).
4. **Integrate** — Claude Code ports the *changes* into the built `index.html`
   (use the `/integrate-design` skill). Never replace a built page wholesale with
   the export: the built pages are plain HTML/CSS/JS with no dc-runtime, and they
   carry local customizations (below) that the exports don't have.

## Local customizations (preserve these when integrating a new export)

These exist only in the built pages, not in the Claude Design sources. Re-apply or
keep them unless the user says otherwise:

- **Header nav links** (both pages): Products / Solutions / Services are `<a class="header-link">`
  overlays linking to dell.com/en-uk pages in a new tab. Claude Design exports use
  `alert()` placeholders for these — keep the links.
- **Deep links into the product page**: `webpage_layout/index.html#overview|dd|diag|sr|pr`
  opens that view (hash read on load). Don't rename the view keys.
- **"Diagnose my system" pill** on the landing page is a link to
  `webpage_layout/index.html#diag`; the other two pills fill the search box.
  The product page also accepts `?view=diag`, which is the form the design uses.
- **"Troubleshoot an issue" / "Find a driver" pills** fill the search box rather than
  showing the design's alerts.
- **Real product data from `data/product.json`**: the design shows `XXX` placeholders
  on the landing page's "This PC" card and Recently viewed cards. The built page keeps
  those placeholders in the HTML (`data-field="thisPc.model"` etc.) and fills them from
  `data/product.json` on load. The recently viewed cards are built from
  `recentlyViewed`. Keep real data out of the HTML; edit the JSON instead. Any missing
  or empty value, or a missing file, falls back to the `XXX` placeholder.
  `data/product.json` is **git-ignored** because it holds the real service tag;
  `data/product.example.json` is the committed template.
- **Sensitive data**: never put the service tag or express service code in a tracked
  file. `.gitignore` also excludes `latest.zip` and `old_designs/`, because the
  exports bundle every screenshot.
- **Redacted images**: the service tag (and express service code) were painted out of
  `webpage_layout/uploads/product_page_banner.png`, `screenshots/product_page_banner.png`
  and `uploads/dellsupportUKshort2.png`. Since the 2026-10-15 export, Claude Design
  also has the redacted banner, but still **look at `product_page_banner.png` and
  `.thumbnail` in every export** before copying them, and never copy an unredacted one.
- **Recently viewed cards** can be closed with their ✕ (the design's ✕ is static).
- **Default view**: the built product page opens on Overview (the `.dc.html` opens with no view).
- **Shared header image**: the landing page loads
  `webpage_layout/uploads/header-1792004093968-9bg6.png` — if that file is renamed,
  update both pages.
- **Virtual Assistant is shared code**: the button and chat drawer live in
  `shared/va.css` + `shared/va.js`, included by both pages. `va.js` builds its own
  markup, which is the plain-HTML equivalent of the design's
  `<dc-import name="Virtual Assistant">`. Port changes from `Virtual Assistant.dc.html`
  (and the VA parts of the page designs) into these two files, never into a page. The
  icon is `uploads/mindellva.png`, resolved relative to `va.js`.
- **VA memory**: drawer open/closed is kept in localStorage `dell_va_open`, and the
  conversation is kept in `dell_va_chat` as `{messages, ended}`. These are the same
  keys as the design, so the chat carries across pages and reloads. A first visit
  opens on the "chat ended" notice.

## Conventions

- **Screenshot overlays**: interactivity is added with invisible absolutely-positioned
  buttons/links over an image. Positions are **percentages of the image box**
  (`left/top/width/height`), so they scale with the page. Copy the percentages from the
  `.dc.html` when a design adds or moves them.
- **dc → plain HTML mapping**: `<sc-if value="{{ xOpen }}">` blocks become
  `<div class="section" id="viewX">` toggled by the `active` class;
  `onClick="{{ fn }}"` becomes an `addEventListener` in the page's `<script>`;
  the `DCLogic` `renderVals()` state becomes plain JS (`showView`, `showTab`).
- **Product page view keys**: `overview`, `dd` (Drivers & Downloads), `diag`
  (Diagnostics), `sr` (Service Requests), `pr` (Parts & Repairs).
- **Screenshot naming**: `product_page_<section>_<part>.png`, section codes
  `o` (overview), `dd`, `d` (diagnostics), `sr`, `pr`. (`produce_page_dd_middle2.png`
  is a historical typo — keep the name, pages reference it.)
- Claude Design re-encodes and sometimes renames uploads on export
  (e.g. `screenshots/header.png` → `uploads/header-<id>.png`). The built pages
  reference the **exported** names under `webpage_layout/uploads/`.

## Build Notes

- No build tools — pure HTML/CSS/JS.
- **View via `serve.cmd`** (runs `python -m http.server 8000` and opens
  http://localhost:8000/). The landing page fetches `data/product.json`, which browsers
  block over `file://`. Opened directly, the page still works but shows the `XXX`
  placeholders. The product page works either way.
- Google Fonts: Manrope (landing page), Public Sans (chat panel).
- All images are local.
- `.dc.html` files and `support.js` are reference only — never edit them by hand;
  they are replaced by the next export.

## Git / GitHub

- Remote `origin` → https://github.com/jfharney77/d_mockup.git, branch `main`.
- **Before every commit**, check that nothing tracked contains the service tag or
  express service code. That means searching the staged text files, and *looking at*
  any new or changed images, because a text search can't see inside them. Run
  `git status` to confirm `data/product.json`, `latest.zip` and `old_designs/` aren't staged.
- Someone cloning the repo gets the `XXX` placeholders on the landing page until they
  copy `data/product.example.json` to `data/product.json` and fill it in.
