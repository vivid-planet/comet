---
"@comet/site-next": minor
---

Introduce new package `@comet/site-next` as copy of `@comet/cms-site`

Changes:

-   Remove `styled-components` as peer dependency
-   use SCSS modules instead
-   `@comet/site-next` is pure ESM

To load the CSS, you need to import it like this:

```ts
import "@comet/site-next/css";
```

In Next.js you can do that in `/app/layout.tsx`.
