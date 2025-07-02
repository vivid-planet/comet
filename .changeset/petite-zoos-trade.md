---
"@comet/cms-admin": major
---

Use ContentScope interface augmentation in admin

The export `ContentScopeInterface` has been renamed to `ContentScope`.
Also, generics have been removed from `ContentScopeSelect`, `ContentScopeControls` and `useContentScope`.
All these things hardly were used in projects.
