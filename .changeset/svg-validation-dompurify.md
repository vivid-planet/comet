---
"@comet/cms-api": patch
---

Validate uploaded SVGs with `DOMPurify` (backed by `jsdom`) instead of the custom XML-based check

The previous implementation parsed SVGs with `fast-xml-parser` and applied a hand-written allow/deny list to reject scripts, event handlers and unsafe links.
SVGs are now sanitized with the vetted `DOMPurify` library and rejected when it has to strip any tags or attributes, providing more robust protection against XSS vectors in uploaded SVGs.
