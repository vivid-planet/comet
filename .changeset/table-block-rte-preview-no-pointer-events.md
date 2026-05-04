---
"@comet/cms-admin": patch
---

Prevent links in the `TableBlock` RTE cell preview from opening when editing a cell

Double-clicking a cell to edit it would open any link in the preview.
Pointer events are now disabled on the preview, while text selection still works.
