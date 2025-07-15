---
"@comet/site-nextjs": patch
---

Include `@comet/site-react` in the bundle of `@comet/site-nextjs`

Previously, `@comet/site-react` was treated as an external dependency.

In `@comet/site-nextjs`' index.ts, many exports from `@comet/site-react` are reexported.
This caused problems in NextJS when using methods from `@comet/site-react` in the middleware.
Edge runtime errors containing completely unrelated modules occurred, e.g.

> The error was caused by importing 'usehooks-ts/dist/index.js' in '../../packages/site/site-react/lib/cookies/useLocalStorageCookieApi.js'.
>
> Import trace for requested module:
> ../../packages/site/site-react/lib/cookies/useLocalStorageCookieApi.js
> ../../packages/site/site-react/lib/index.js
> ../../packages/site/site-nextjs/lib/index.js
> ./src/middleware/predefinedPages.ts
> ./src/middleware.ts
> occurred in a file that only imported

```ts
import { createFetchWithDefaults, createGraphQLFetch } from "@comet/site-nextjs";
```

This is due to a Webpack behavior that pulls all exports in the reexport statement into the middleware bundle.

Bundling `@comet/site-react` with `@comet/site-nextjs` prevents this behavior and the associated error.
