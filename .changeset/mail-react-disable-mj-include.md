---
"@dextinity/mail-react": patch
---

Disable `mj-include` in the server `renderMailHtml` by default

Security fix for [CVE-2025-67898](https://github.com/advisories/GHSA-45h5-66jx-r2wf): in `mjml` 4, an `<mj-include>` in the MJML can read files on the server into the rendered mail.
Projects that use `mj-include` must pass `ignoreIncludes: false`. Otherwise, the include is removed without a warning.
