---
"@comet/cms-api": patch
---

Prevent creating a second page with the slug `home` in the same scope

The home page is stored with the slug `home` but lives at the canonical path `/`. Because looking up `/home` always resolved to `null`, the duplicate-path check failed to detect an existing home page. As a result, copying the home page produced a second page with the slug `home`, and afterwards none of the home pages could be deleted (deleting a page with the slug `home` is forbidden).

The home page is now correctly recognized as a duplicate. When copying the home page into a scope that already has a home page, the copy receives a different slug (e.g. `home-2`); when the target scope has no home page yet, the copy keeps the slug `home`.
