# Site 404 page renders nested `<html>`/`<body>` causing React mount errors and hydration error

- **Severity:** minor
- **Location:** Site (Next.js) — any unknown URL, e.g. `http://localhost:3000/en/this-page-does-not-exist`
- **Affected code:** `demo/site/src/app/not-found.tsx` and `demo/site/src/app/[visibility]/[domain]/[language]/not-found.tsx`

## Summary

Both `not-found.tsx` files render their own `<html>` and `<body>` elements:

```tsx
export default async function NotFound404() {
    const scope = getNotFoundContext() || { domain: "main", language: "en" };
    return (
        <html lang={scope.language}>
            <body>
                <p>Page not found (Scope {JSON.stringify(scope)}).</p>
                ...
```

In the Next.js App Router, `not-found.tsx` is rendered _inside_ the root layout, which already renders `<html>`/`<body>` (only `global-error.tsx` may define its own). The result on every 404 is invalid nested markup and a stream of React errors:

```
In HTML, <html> cannot be a child of <body>. This will cause a hydration error.
<body> cannot contain a nested <html>.
You are mounting a new html component when a previous one has not first unmounted. ... html
You are mounting a new body component when a previous one has not first unmounted. ... body
```

The rendered 404 page also looks broken: the site header/menu renders above an unstyled "Page not found (Scope …)" text with the raw scope JSON, and the Next.js dev overlay reports 4 issues.

## Steps to reproduce

1. Start the demo site.
2. Open `http://localhost:3000/en/this-page-does-not-exist`.
3. Check the browser console and the dev-overlay issue counter.

## Expected vs. actual behavior

- **Expected:** `not-found.tsx` returns only the page content (no `<html>`/`<body>`); the 404 page renders inside the normal layout without hydration/mount errors.
- **Actual:** Nested `<html>`/`<body>` markup, four React errors plus a hydration error on every 404 response.

## Evidence

- Screenshot: [screenshots/007-site-404.png](screenshots/007-site-404.png)
- Screencast: [screencasts/007-site-404-nested-html.webm](screencasts/007-site-404-nested-html.webm)
