---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Allow filtering, searching and sorting warnings by name, info and type

The warnings data grid now supports filtering and full-text searching by the related entity's name and secondary information, filtering by type, and sorting by name and type.

On the API, the `WarningFilter` gains `name` and `secondaryInformation` fields and `WarningSortField` gains a `name` value. The related entity's name and secondary information are resolved by joining the `EntityInfo` view, while the type is read from the warning's `sourceInfo`. The view is only joined when a query actually references name or info. A migration adds an index on the `EntityInfo` join keys to keep that join fast.
