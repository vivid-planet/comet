---
title: Runtime Architecture & Authentication Flows
sidebar_position: 2
---

# Runtime Architecture & Authentication Flows

This page walks through the four runtime scenarios of a typical Comet DXP project — the public Site, the Admin SPA, Block Preview, and Site Preview — and how each one authenticates. Every scenario shares the same backend (API, PostgreSQL, imgproxy, blob storage); what differs is the ingress and the auth geometry around it.

- **§1a Public Site** — anonymous visitor → Site → API. No login anywhere.
- **§1b-1 Authenticated Admin** — editor → OAuth2-Proxy (OIDC) → Admin and API.
- **§1b-2 Admin + Block Preview** — editor in Admin drives a Site-hosted IFrameBridge via `postMessage`.
- **§1b-3 Admin + Site Preview** — editor opens a full draft page; Admin hands off a short-lived JWT to the public Site.

**Admin and Site are separate applications**, in their own containers, served from their own hostnames (`admin.comet-dxp.com` and `preview.comet-dxp.com`). They never talk to each other directly — Admin only links into Site Preview via browser URLs/iframes.

All four diagrams share the same color conventions:

- **Orange** — Client side (browser, visitor/editor, Admin SPA).
- **Green** — Server side — public (Traefik, Site container, bridge/preview routes).
- **Gray** — Server side — internal (API, PostgreSQL, imgproxy, blob storage).
- **Red** — OAuth2-Proxy, the authentication gate.
- **Pink** — IFrameBridge (cross-origin block preview bridge).
- **Purple** — Site Preview iframe (cross-origin full-page preview).

---

### 1a. Site (no authentication)

![Site (no authentication) diagram](./diagrams/architecture-1a.svg)

The diagram splits the world into three zones:

- **Client side** (orange) — the anonymous **Public visitor** and their **browser** rendering the **Site**.
- **Server side — public** (green) — **Traefik** (edge router) and the **Site container (Next.js)**. Exposes public `page routes`, a `/graphql` server-side forwarder, the **ISR cache-handler** and a `/dam/*` middleware route.
- **Server side — internal** (gray) — **API**, **PostgreSQL**, **imgproxy**, **Blob storage**. No public DNS, no Traefik route, no exposed ports. Only the Site container may reach it.

**Walk through a single page load.**

1. **Visitor opens the URL** (`comet-dxp.com/en/…`). Browser sends an HTTPS GET to Traefik, which terminates TLS.
2. **Traefik routes the HTML request to the Site container** (Next.js). In the common case this is served straight from the **ISR cache-handler** (~7.5 min revalidate) with no API call; on a miss Next.js renders server-side, fetching published content from the API over the internal network.
3. **Browser hydrates and issues client-side GraphQL** to `/graphql` on the _Site_ — these are **persisted queries** (shipped with the bundle, referenced by hash), not raw GraphQL. The Site's `/graphql` route is a server-side forwarder, not a direct API ingress.
4. **Site → API** (cache miss or client GraphQL). Both the SSR/ISR page render and the `/graphql` forwarder call the internal API over the Docker network, authenticated as the built-in `system-user` via HTTP **Basic Auth** (`API_BASIC_AUTH_SYSTEM_USER_PASSWORD`). The API hits PostgreSQL for content.
5. **Browser requests a DAM image** (`GET /dam/…`). The URL carries an HMAC signature issued by the API, so it cannot be tampered with.
6. **Traefik routes `/dam/*` to the Site container**.
7. **Site middleware (`damRewrite.ts`)** rewrites the request to `API_URL_INTERNAL/dam/…` — the browser never knows imgproxy exists.
8. **API → imgproxy** for the transform (resize, format).
9. **imgproxy → Blob storage** to read the source bytes; the transformed image streams back up the chain.

Most visits only touch steps 1–2 and the image path. The API is only consulted on cache misses, on client-side GraphQL, and behind DAM requests.

**Why the API stays invisible.** The entire internal zone has no public DNS, no Traefik route, no exposed ports. Everything the browser reaches on the public hostname is served by the Site container; anything further is a server-to-server hop inside the Docker network. The Site always sends `visibility=published`, so even if the `system-user` credentials leaked the caller could not request drafts. No OAuth2-Proxy, no OIDC, no per-user session — the visitor is anonymous end-to-end.

---

### 1b-1. Authenticated Admin (plain, no preview)

Editor opens Admin, logs in via OIDC, browses and edits content. No iframes, no Site involvement.

![Authenticated Admin diagram](./diagrams/architecture-1b-1.svg)

The diagram has three zones plus the external IDP:

- **Client side** (orange) — the **Editor** and their browser tab, hosting the **Admin (SPA)**.
- **🛡️ OAuth2-Proxy gate** (red) — the only ingress to `admin.comet-dxp.com`. Every request to the Admin container or API passes through it. OAP also owns a **session store** mapping each `_oauth2_proxy` cookie to the JWT / refresh token it obtained from the IDP — the browser only ever holds an opaque session cookie, never a raw token.
- **🔒 Server side — internal** (gray) — **Admin container (:8001)** (serves the built SPA bundle — `index.html` + JS/CSS produced by `vite build`) and the **Internal network** (**API :4000**, **PostgreSQL**). No public DNS, no Traefik route of its own, no exposed ports.
- **OIDC IDP** — external identity provider; OAP redirects the browser here to log the user in and exchanges the code for tokens.

**Walk through the flow.**

1. **First load.** Browser requests `https://admin.comet-dxp.com`. OAP sees no `_oauth2_proxy` cookie.
2. **OIDC login.** OAP redirects the browser to the IDP and runs the **OIDC authorization code flow**, blocking the original request until the IDP returns an authorization code.
3. **Cookie set.** OAP exchanges the code for an ID/access token pair, stores the tokens in its **session store** keyed by a new `_oauth2_proxy` session cookie, and redirects back to `admin.comet-dxp.com`. The browser only ever receives the opaque cookie — never a raw JWT.
4. **Static assets.** Browser re-requests `/index.html`, JS and CSS with the cookie attached. OAP re-validates the cookie on every hop — unauthenticated requests never reach the Admin container.
5. **SPA bundle served.** OAP proxies the static requests upstream to the Admin container, which is effectively a static file server. The browser caches the bundle.
6. **Runtime GraphQL.** Once the SPA is booted, all `POST /api/graphql` calls carry the same `_oauth2_proxy` cookie back through OAP.
7. **JWT swap.** OAP strips the cookie, looks up the associated session in its store, retrieves the IDP-issued JWT, and forwards the request to the API with `Authorization: Bearer <JWT>`. The API validates the JWT against the IDP JWKS and talks to PostgreSQL.

**Static assets are guarded too.** OAP fronts the entire `admin.comet-dxp.com` hostname, not only `/api/*`. An unauthenticated `GET /index.html` is redirected to the IDP before the Admin container is contacted — so an editor who isn't logged in cannot even download the SPA bundle.

**Auth summary:** one OIDC session cookie in the browser; OAuth2-Proxy converts it to a Bearer JWT on every API hop; the API validates that JWT against the IDP JWKS. No credentials ever live inside the SPA.

---

### 1b-2. Admin + Block Preview iframe (IFrameBridge, postMessage)

The Admin SPA needs to render a live preview of the block the editor is working on — but the block should be rendered by the _Site_ so it matches production output. The mechanism is two cooperating **IFrameBridge** instances — one inside Admin, one inside the Site container — talking over `window.postMessage`.

![Admin + Block Preview iframe diagram](./diagrams/architecture-1b-2.svg)

**Pieces in the diagram.**

- **Admin (SPA)** (orange) on `admin.comet-dxp.com` — holds the `_oauth2_proxy` cookie. Contains an **Application** (the editing UI) and an embedded **IFrameBridge** (pink, dashed) whose inner `<iframe>` points at `preview.comet-dxp.com/block-preview/…`.
- **🛡️ OAuth2-Proxy** (red) — same gate as 1b-1. Every request on `admin.comet-dxp.com` goes through it; `preview.comet-dxp.com` bypasses it.
- **🔗 Admin → API** (slate, collapsed) — the OIDC / Bearer-JWT path from 1b-1 that fetches actual block data, drawn as a single reference block so the diagram can foreground the `postMessage` channel.
- **🌐 Server side — public → Site container (`preview.comet-dxp.com`)** (green) — serves the `/block-preview/[scope]/[block]` route, which contains its own **IFrameBridge** and a **Rendered block preview** (HTML built from the JSON it receives).

**Walk through the flow.**

1. **Application fetches data (GraphQL).** The Admin Application calls the API through OAuth2-Proxy (standard 1b-1 path) to load the block data it's about to preview.
2. **window.postMessage: block data (JSON)** — Admin Application → Admin IFrameBridge (same origin). The merged block JSON (saved content + in-memory edits) is handed off to the bridge running inside the Admin.
3. **postMessage: block data (JSON)** — Admin IFrameBridge → Site IFrameBridge (cross-origin). The same payload is forwarded across the origin boundary.
4. **postMessage: preview events** — Site IFrameBridge → Admin IFrameBridge. Hover, click, and edit-selection events flow back so the Application can highlight what the editor points at inside the iframe.
5. **Site renders.** The Site IFrameBridge feeds the received JSON into the `/block-preview` route's renderer, producing the HTML the editor sees inside the iframe.

**Why `postMessage` and not HTTP.** The Admin origin (`admin.comet-dxp.com`) and the Site origin (`preview.comet-dxp.com`) are separate origins under the Same-Origin Policy; they cannot share cookies or read each other's fetches. `window.postMessage` is the one channel the browser allows across origins, and it carries no credentials — so there is nothing to authenticate. The _data_ being sent was already fetched via the authenticated 1b-1 path, so re-authenticating inside the iframe would be redundant.

**Auth consequence.** There is still only **one** authenticated path in this flow (Admin → OAuth2-Proxy → API, shown as 1b-1). The Site's `/block-preview` route is publicly reachable because it never talks to the API on the user's behalf — it only renders what `postMessage` pushes into it.

---

### 1b-3. Admin + Site Preview iframe (full page preview)

Editor opens **Site Preview** at `admin.comet-dxp.com/{scope}/preview/?path=…`. Admin renders a cross-origin iframe that loads the Site's `/site-preview` route on `preview.comet-dxp.com`, and the Site serves the **complete draft page** (not just one block). One browser tab now hosts two origins with **different auth systems**, and the clever part is how the editor's authenticated session is translated into a preview session the Site can act on — without ever sharing cookies or tokens across origins.

![Admin + Site Preview iframe diagram](./diagrams/architecture-1b-3.svg)

**Pieces in the diagram.**

- **Admin (SPA)** (orange) on `admin.comet-dxp.com` — holds the `_oauth2_proxy` cookie. Contains an **Application** and a **Site Preview** block (purple, dashed) hosting the cross-origin `<iframe>` with `src=preview.comet-dxp.com/site-preview?jwt=…`.
- **🛡️ OAuth2-Proxy** (red) — guards `admin.comet-dxp.com` and the API ingress; it is **not** in front of `preview.comet-dxp.com`.
- **🌐 Server side — public → Site container (`preview.comet-dxp.com`)** (green) — the `/site-preview` route is modelled as two branches gated by a **🔐 JWT guard** (verifies `?jwt=` with `SITE_PREVIEW_SECRET`): either **Invalid JWT Page (HTTP 400)** for bad/expired tokens, or **Render Site Preview Page** for valid ones.
- **🔒 Server side — internal** (gray) — **API :4000** (mints short-lived preview JWTs and returns draft content) and **PostgreSQL**.

**Walk through the flow.**

1. **Admin requests a preview JWT.** Admin's Application calls GraphQL `sitePreviewJwt(scope, path, includeInvisible)` against the API, carrying the `_oauth2_proxy` cookie through OAuth2-Proxy.
2. **OAuth2-Proxy swaps cookie → Bearer JWT** and forwards the request to the API (same mechanism as 1b-1). The API enforces `RequiredPermission("pageTree", "sitePreview")`.
3. **API mints a 10-second JWT** signed with `SITE_PREVIEW_SECRET`, carrying `{userId, scope, path, previewData}`, and returns it through OAuth2-Proxy back to the **Site Preview** block in the Admin.
4. **Admin renders the iframe** with `src=preview.comet-dxp.com/site-preview?jwt=…` — crossing the origin boundary.
5. **iframe GETs `/site-preview?jwt=…`.** No cookie yet; the URL JWT is the only credential. This hits the Site's **JWT guard**, which verifies the signature and expiry against `SITE_PREVIEW_SECRET`. Invalid or expired → **Invalid JWT Page (HTTP 400)**.
6. **Valid JWT → Set-Cookie + 302.** The **Render Site Preview Page** branch mints a new long-lived (1 day) JWT with the same secret, sets it as `__comet_site_preview` (httpOnly, sameSite: lax), enables Next.js `draftMode()`, and redirects to `data.path`.
7. **SSR fetch against the API.** With the cookie attached, the Site's render runs SSR GraphQL to the internal API. Transport is still **Basic Auth: `system-user`** (the Site's own credential); draft access is authorized by the `x-include-invisible-content` / `x-preview-dam-urls` headers derived from the cookie JWT's `previewData`. The API never sees the user's identity.
8. **API returns draft content (JSON)** to Render Site Preview Page, which builds the HTML and ships it to the iframe.

**Why this is safe.**

- **Two separate secrets, no crossover.**
  - `admin.comet-dxp.com` authenticates **the person** (OIDC cookie → Bearer JWT, via OAuth2-Proxy).
  - `preview.comet-dxp.com` authenticates **the act of previewing** (`SITE_PREVIEW_SECRET` → short-lived URL JWT → long-lived cookie JWT). The editor's Admin cookie never travels to `preview.comet-dxp.com`; OAuth2-Proxy isn't on that hostname.
- **`SITE_PREVIEW_SECRET` never leaves the server.** It lives as an env var on the API and the Site. The browser only ever sees the signed JWTs those servers mint — and those are scoped to one path + ContentScope.
- **The URL JWT is short-lived.** Ten seconds is enough for the iframe's initial GET but too short for a stolen preview URL to be replayed.
- **The API stays internal.** Every GraphQL call in this diagram is Site → API over the Docker network. The browser at `preview.comet-dxp.com` only ever talks to the Site container.

**Why not just share the Admin cookie.** Collapsing the two auth systems would force either (a) putting OAuth2-Proxy on `preview.comet-dxp.com` (and requiring IDP login for every anonymous visitor to the public Site from §1a), or (b) leaking the editor's OIDC token across origins. Both break the "Site is a pure renderer with one system credential" property that 1a relies on.
