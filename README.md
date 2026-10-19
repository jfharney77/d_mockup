# Dell Support Mockup

Interactive HTML mockups of the Dell UK Support website, built from Claude Design prototypes and connected to local personalization services.

## Pages

### Support Assistant landing page

`index.html` provides:

- Dark Dell Support hero and prompt box
- Quick actions for troubleshooting, drivers, and diagnostics
- Product and recently viewed cards loaded from local JSON
- Launcher fields for `service_tag`, `visit_id`, `start`, and `end`
- Shared Virtual Assistant drawer

Launching the Virtual Assistant clears the previous conversation, displays the supplied context, and calls the probing-agent proxy. The first three returned probing questions appear as compact gradient-outline buttons. If the proxy is unavailable, the UI randomly selects three unique questions from a local six-question fallback set.

The chat content starts empty whenever the page reloads. Selecting a question places it into the input. Sending text directly calls the visit-ID proxy using that text as the service tag.

### Product support page

`webpage_layout/index.html` provides five sidebar views:

- Overview
- Drivers & Downloads
- Diagnostics
- Service Requests
- Parts & Repairs

The views support these deep links:

```text
webpage_layout/index.html#overview
webpage_layout/index.html#dd
webpage_layout/index.html#diag
webpage_layout/index.html#sr
webpage_layout/index.html#pr
```

Both pages use the Virtual Assistant implementation in `shared/va.css` and `shared/va.js`.

## Architecture

The frontend is static HTML, CSS, and JavaScript served on port 8000. It calls a FastAPI proxy maintained in the adjacent `onlinepersonalizationagent` repository.

```text
Browser :8000
  -> Frontend proxy :8001
       -> Graph API :8106
       -> Probing Agent :8104
```

The proxy exposes:

| Endpoint | Purpose |
|---|---|
| `POST /visit-ids` | Convert a service tag to graph visit IDs |
| `POST /probing-agent/run` | Generate probing questions from service and visit context |

The maintained proxy source is located at:

```text
/home/john_harney/gitlab/onlinepersonalizationagent/src/proxy_api
```

A former local proxy is retained under `legacy/api/`. The entire `legacy/` directory is git-ignored and is not committed.

## Start the application

Run each service in a separate terminal.

### 1. Graph API

```bash
cd /home/john_harney/gitlab/onlinepersonalizationagent
./scripts/agents/start_graph_api_server.sh
```

The graph API listens on `http://127.0.0.1:8106`.

### 2. Probing Agent

```bash
cd /home/john_harney/gitlab/onlinepersonalizationagent
./scripts/agents/start_probing_question_agent_server.sh
```

The probing-agent API listens on `http://127.0.0.1:8104`.

### 3. Frontend proxy

```bash
cd /home/john_harney/gitlab/onlinepersonalizationagent/src/proxy_api
./start_api.sh
```

The proxy listens on `http://127.0.0.1:8001`.

Its upstream URLs are configurable in the `onlinepersonalizationagent` `.env` file:

```dotenv
PROXY_API_HOST='127.0.0.1'
PROXY_API_PORT='8001'
PROXY_GRAPH_API_URL='http://127.0.0.1:8106'
PROXY_PROBING_AGENT_URL='http://127.0.0.1:8104'
```

### 4. Mockup frontend

```bash
cd /home/john_harney/github/d_mockup
python3 -m http.server 8000
```

Open:

- Landing page: `http://localhost:8000/`
- Product page: `http://localhost:8000/webpage_layout/`

Stop each process with **Ctrl+C**.

## Product data

The landing page fetches `data/product.json`. To create it locally:

```bash
cp data/product.example.json data/product.json
```

Fill in local values as needed. `data/product.json` is git-ignored because it may contain a real service tag or express service code. Missing data displays the committed `XXX` placeholders.

## Repository layout

```text
index.html                         Built landing page
webpage_layout/index.html          Built product support page
shared/va.css                      Shared Virtual Assistant styles
shared/va.js                       Shared Virtual Assistant behavior
Support Assistant.dc.html          Landing-page design specification
Virtual Assistant.dc.html          Virtual Assistant design specification
webpage_layout/Product Page.dc.html Product-page design specification
data/product.example.json          Safe product-data template
screenshots/                        Original reference screenshots
uploads/                            Landing-page assets
webpage_layout/uploads/             Product-page assets
legacy/                             Local-only ignored files
```

The `.dc.html` files and `support.js` are design references, not the built application. Do not edit them manually.

## Development and verification

There is no frontend build step or package installation.

For JavaScript changes:

```bash
node --check shared/va.js
git diff --check
```

Serve the pages over HTTP and manually verify the affected interaction. Opening `index.html` through `file://` prevents the browser from loading `data/product.json`.

## Security

Do not commit:

- Real service tags or express service codes
- `.env` files or credentials
- Unredacted screenshots
- `latest.zip` or archived Claude Design exports
- Anything under `legacy/`
