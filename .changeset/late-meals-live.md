---
"@comet/cms-api": major
---

Switch to SQL-based entity info system

The `@EntityInfo` decorator now accepts a field-path-based object or a raw SQL string instead of a TypeScript function or service class.
This enables efficient SQL-level filtering and sorting of dependencies and warnings based on entity info.

**Breaking changes:**

- `@EntityInfo` decorator API changed: now accepts `{ name, secondaryInformation?, visible? }` with dot-notation field paths, or a raw SQL string
- `EntityInfoServiceInterface` has been removed from exports
- `PageTreeNodeDocumentEntityInfoService` has been removed; `@EntityInfo` on `Page`, `Link`, and similar document entities is no longer needed
- `block_index_dependencies` view exposes two new columns `blockVisible` and `entityVisible`; `visible` is now their logical AND (previously only reflected block-level visibility)
- `block_index_dependencies` view now includes `rootName`, `rootSecondaryInformation`, `targetName`, and `targetSecondaryInformation` columns from `EntityInfo`, removing the need for a runtime JOIN when querying dependencies/dependents
