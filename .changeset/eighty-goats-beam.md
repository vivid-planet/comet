---
"@comet/cms-api": minor
---

Ignore filters in `@AffectedEntity` check

When using the `@AffectedEntity` decorator we possibly also want to check entities which are filtered by default. Since we don't know how the entity is handled in the resolver we ignore the filters completely.
