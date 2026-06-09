---
"@comet/cms-api": minor
---

Filter `fullTextSearch` results by the entity's visibility

The `visible` state of an entity (declared via the `visible` option of the `@EntityInfo` decorator) is now included in the `EntityInfoFullText` SQL view.

The `fullTextSearch` query now respects the `x-include-invisible-content` header via `@RequestContext()`: invisible entities are only returned when invisible pages are requested (e.g. for authenticated admin users), otherwise results are filtered to visible entities only. This is in preparation for using `fullTextSearch` on the site.
