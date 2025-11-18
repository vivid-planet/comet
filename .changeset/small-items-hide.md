---
"@comet/cms-api": patch
---

Fix filtering issues in RedirectsGrid

- Fix `isEmpty` and `isNotEmpty` filters for `stringMatchesFilter`
- Fix boolean filter handling: properly handle the "any" case (when no specific value is set)
- Add support for `activatedAt` field in redirect filters
