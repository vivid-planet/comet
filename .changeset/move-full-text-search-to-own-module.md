---
"@comet/cms-api": minor
---

Add `FullTextSearchModule` that must be imported separately to enable the `fullTextSearch` query

Previously, `FullTextSearchResolver` was part of `EntityInfoModule`, causing it to be loaded indirectly by any module importing `EntityInfoModule` (e.g., `WarningsModule`).
Now, the resolver lives in its own `FullTextSearchModule` that explicitly depends on `EntityInfoModule`.

To keep the `fullTextSearch` query working, add `FullTextSearchModule` to your app imports:

```ts
import { FullTextSearchModule } from "@comet/cms-api";

// In your AppModule imports:
FullTextSearchModule;
```
