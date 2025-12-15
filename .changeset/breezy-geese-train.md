---
"@comet/admin": minor
---

Add `UrlField` and `FinalFormUrlInput` components for URL input with automatic protocol handling

The new components automatically adds `https://` to URLs that don't have a protocol and `mailto:` to email addresses when the field loses focus.
Existing protocols (e.g., `http:`, `ftp://`) are preserved.
The field also has a rudimentary validation that checks if a protocol is present.
