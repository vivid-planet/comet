---
"@comet/cms-admin": minor
---

Admin Generator: Add custom init-query options to asyncSelect

-    Setting `gqlFieldName` generates an graphql-alias, e.g. to reuse the same nested object multiple times. This is for instance sometimes required to implement a filter-field
-    Setting `initQueryIdPath` or `initQueryLabelPath` generates an asyncSelect initializing data from non-standard fields. If nested use dot-separation. 
