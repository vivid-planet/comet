---
"@comet/blocks-admin": patch
---

Fix the top position of the rich text editor toolbar

Previously, the rich text editor's toolbar would be moved too far down when used inside `AdminComponentRoot`, but not as a direct child.
