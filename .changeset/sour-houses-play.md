---
"@comet/blocks-admin": patch
---

Fix the top position of the rich-text toolbar

Previously, the rich-text toolbar would be moved too far down when used inside `AdminComponentRoot`, but not as a direct child.
