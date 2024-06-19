---
"@comet/cms-api": major
---

Rename DateFilter to DateTimeFilter

This leaves room for a future DateFilter that only filters by date, not time.

## Upgrading

1. Replace

```ts
import { DateFilter } from "@comet/cms-api";
```

with

```ts
import { DateTimeFilter } from "@comet/cms-api";
```

2. Re-run api generator.
