---
"@comet/cms-api": patch
---

Validate uploaded SVGs with `DOMPurify` (backed by `jsdom`) instead of the custom XML-based check

The previous implementation parsed SVGs with `fast-xml-parser` and applied a hand-written allow/deny list to reject scripts, event handlers and unsafe links.
SVGs are now sanitized with the vetted `DOMPurify` library and rejected when it has to strip any tags or attributes, providing more robust protection against XSS vectors in uploaded SVGs.

The `role` attribute and the `<use>` element are allowed, since they're commonly used in valid SVGs. `<use>` is restricted to same-document fragment references (e.g. `href="#id"`); references to external resources are rejected to prevent XSS/SSRF.
