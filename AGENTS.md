# Dell Support Mockup

## Purpose

This repository contains interactive, screenshot-based mockups of the Dell UK Support site. The built pages are plain HTML, CSS, and JavaScript; there is no frontend build step.

## Built pages

| Page | File |
|---|---|
| Support Assistant landing page | `index.html` |
| XPS 16 9640 product support page | `webpage_layout/index.html` |

Both pages load the shared Virtual Assistant from `shared/va.css` and `shared/va.js`.

## Source and generated material

- `Support Assistant.dc.html`, `Virtual Assistant.dc.html`, and `webpage_layout/Product Page.dc.html` are Claude Design specifications.
- `support.js` files are the dc-runtime used only by the design specifications.
- Do not edit `.dc.html` files or `support.js` by hand; new design exports replace them.
- `screenshots/` contains source references.
- `uploads/` and `webpage_layout/uploads/` contain assets used by the built pages.
- Preserve local behavior when integrating a new design instead of replacing a built page wholesale.

## Virtual Assistant

- Shared implementation: `shared/va.js` and `shared/va.css`.
- Drawer open/closed state uses localStorage key `dell_va_open`.
- Chat content is cleared on each page load.
- The landing-page launcher supplies `service_tag`, `visit_id`, `start`, and `end`.
- Launching the assistant calls `POST http://localhost:8001/probing-agent/run`.
- The first three returned `probing_questions[].question` values are rendered as compact gradient-outline buttons.
- If the proxy is unavailable, three unique questions are selected randomly from the six local fallback questions.
- Selecting a question places it into the chat input.
- Sending text directly in the chat calls `POST http://localhost:8001/visit-ids`, using the text as `service_tag`.

## API architecture

The maintained proxy is in the adjacent `onlinepersonalizationagent` repository:

```text
/home/john_harney/gitlab/onlinepersonalizationagent/src/proxy_api
```

Request flow:

```text
Browser :8000
  -> Frontend proxy :8001
       -> Graph API :8106
       -> Probing Agent :8104
```

Proxy endpoints used by this repository:

- `POST /visit-ids`
- `POST /probing-agent/run`

A former local proxy is retained at `legacy/api/`. The complete `legacy/` directory is git-ignored and must remain local-only.

## Running locally

Start these in separate terminals:

```bash
cd /home/john_harney/gitlab/onlinepersonalizationagent
./scripts/agents/start_graph_api_server.sh
```

```bash
cd /home/john_harney/gitlab/onlinepersonalizationagent
./scripts/agents/start_probing_question_agent_server.sh
```

```bash
cd /home/john_harney/gitlab/onlinepersonalizationagent/src/proxy_api
./start_api.sh
```

```bash
cd /home/john_harney/github/d_mockup
python3 -m http.server 8000
```

Open `http://localhost:8000/` for the landing page or `http://localhost:8000/webpage_layout/` for the product page.

## Product data and sensitive information

- Landing-page product data is loaded from git-ignored `data/product.json`.
- `data/product.example.json` is the committed placeholder template.
- Missing values retain the `XXX` placeholders.
- Never commit a real service tag, express service code, credentials, `.env`, export archives, or unredacted screenshots.
- Before committing image changes, inspect them visually for sensitive information.

## Product-page behavior to preserve

- Deep links: `#overview`, `#dd`, `#diag`, `#sr`, and `#pr`.
- Default view: Overview.
- Header navigation overlays link to Dell pages.
- Screenshot interaction overlays use percentage positions so they scale with the image.
- The landing-page Diagnose action links to `webpage_layout/index.html#diag`.

## Verification

There is no frontend test suite. For relevant changes:

```bash
node --check shared/va.js
git diff --check
```

Serve the site over HTTP and manually verify the affected interaction. For proxy changes, verify its health endpoint and both POST routes while the upstream services are running.
