# Admin: unknown routes render a completely blank content area (no 404 feedback)

- **Severity:** minor
- **Location:** Admin — any unknown route, e.g. `http://localhost:8000/main/en/this-route-does-not-exist`

## Summary

Navigating to a URL that doesn't match any admin route (typo, stale bookmark, outdated deep link) renders the header and the menu, but the content area is entirely empty — no "Page not found" message, no redirect to the dashboard. To a user this is indistinguishable from a page that failed to load.

No console errors or failed requests occur; this is purely missing fallback-route handling.

## Steps to reproduce

1. Log in to the Demo Admin.
2. Open `http://localhost:8000/main/en/this-route-does-not-exist` directly in the address bar.

## Expected vs. actual behavior

- **Expected:** A "Page not found" message or a redirect to the dashboard.
- **Actual:** Blank white/grey content area next to the regular navigation; no feedback at all.

## Evidence

- Screenshot: [screenshots/008-admin-blank-route.png](screenshots/008-admin-blank-route.png)
- Screencast: [screencasts/008-admin-unknown-route-blank.webm](screencasts/008-admin-unknown-route-blank.webm)
