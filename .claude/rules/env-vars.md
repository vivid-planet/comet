# Environment Variables

Environment variables are defined in `.env` (committed defaults) at the repo root.
For demo services, port/URL overrides go in `demo/.env.local` (gitignored), which is symlinked into `demo/api/`, `demo/admin/`, and `demo/site/`.
A root-level `.env.local` (also gitignored) can hold non-demo overrides (e.g. `MUI_LICENSE_KEY`).

## Adding a new environment variable

When adding a variable to `.env`, also update `set-ports.js` if applicable:

### Add to `PORT_VARS` in `set-ports.js` if:
- The variable holds a plain port number (e.g. `MY_SERVICE_PORT=1234`)

### Add to `URL_VARS` in `set-ports.js` if:
- The variable holds a URL, address, or any value that references a port variable
  (e.g. `MY_SERVICE_URL=http://localhost:${MY_SERVICE_PORT}`)
- This includes HTTP/HTTPS URLs, host:port strings, comma-separated upstream lists, redirect URLs, etc.

### Do NOT add to `set-ports.js` if:
- The variable is a secret, credential, feature flag, or non-URL string
- The value does not contain or reference a port number

## Checklist when adding a new service

1. Add `MY_SERVICE_PORT=<default>` to `.env`
2. Add `'MY_SERVICE_PORT'` to `PORT_VARS` in `set-ports.js`
3. If you also add URL/address variables referencing that port, add them to `URL_VARS` in `set-ports.js`
4. Keep array ordering consistent with `.env` for readability
