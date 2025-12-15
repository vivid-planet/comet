---
"@comet/admin": minor
---

Add `UrlField` and `FinalFormUrlInput` components for URL input with automatic protocol handling

The new components automatically add `https://` protocol to URLs that don't have a protocol when the field loses focus. Existing protocols (e.g., `mailto:`, `ftp://`) are preserved.
The field also has a rudimentary validation to check if a protocol is present.
