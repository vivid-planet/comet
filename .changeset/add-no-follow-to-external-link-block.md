---
"@comet/cms-api": minor
"@comet/cms-admin": minor
"@comet/site-react": minor
---

Add `noFollow` option to `ExternalLinkBlock`

Editors can now mark an external link as `nofollow` via a new checkbox in the admin form. When enabled, the rendered `<a>` tag receives `rel="nofollow"`.
