# Claude Design brief: Dell Support mockup

Paste this into Claude Design when starting or continuing work on these pages, and
upload the relevant images from `screenshots/`.

## What this is

A clickable mockup of the Dell UK Support site, built from screenshots of the live site.
Each page is a vertical stack of screenshot images, with invisible buttons placed over
the clickable areas. The exported `.dc.html` is converted by hand into a plain
HTML/CSS/JS page, so keep the designs simple to translate.

## Pages

**Product Page** (`Product Page.dc.html`): XPS 16 9640
- Full-width site header image at the top, with overlay buttons for Products, Solutions and Services.
- Grid of 1fr 7fr: the left sidebar image and the main content.
- Sidebar items and their view keys: Overview `overview`, Drivers & Downloads `dd`,
  Diagnostics `diag`, Service Requests `sr`, Parts & Repairs `pr`.
  A highlight (grey row and blue left bar) marks the selected item.
- The main column starts with the product banner (always shown, with overlay buttons),
  followed by the selected view's screenshots.
- Overview has three tabs: Troubleshooting, Popular Solutions and Search Solutions.

**Support Assistant landing page** (`Support Assistant.dc.html`, variant 1a):
dark hero with an AI prompt box, quick-action pills, a product card and a Recently
Viewed section.

**Virtual Assistant** (`Virtual Assistant.dc.html`): both pages have the floating
button and right-hand chat drawer. Keep the localStorage keys `dell_va_open` and
`dell_va_chat`, which let the chat carry over between pages.

## Please keep

- View keys `overview`, `dd`, `diag`, `sr` and `pr`. Other pages link to them.
- Overlay positions as percentages of the image (left/top/width/height).
- Existing upload filenames. Add new images rather than renaming existing ones.
- Placeholder actions as `alert('<label>')`. The built page swaps in real links.
- `XXX` placeholders for product data (model, service tag, warranty, recently viewed
  items). The built page fills them from a data file, so placeholders are fine here.

## Screenshot naming

`product_page_<section>_<part>.png`, where section is `o` (overview), `dd`, `d`
(diagnostics), `sr` or `pr`, and part is `banner1`, `middle1`, `middle2` and so on.
