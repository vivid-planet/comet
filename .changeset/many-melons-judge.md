---
"@comet/cms-admin": patch
---

// TODO: update

Only use the origin (`http://localhost:4000`) of a URL to check if files must be downloaded when copying a page

This makes the check resistant against prefixes in the URL, e.g. `/api` in `http://localhost:4000/api`.

Previously, all files were downloaded and uploaded again even when copying within the same environment.
