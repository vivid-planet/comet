---
"@comet/cms-api": minor
---

Add `deleteRedirects` mutation to `RedirectsResolver`

The new mutation accepts an array of IDs and deletes all matching redirects in a single database operation, replacing the previous approach of issuing individual `deleteRedirect` calls per selected item.
