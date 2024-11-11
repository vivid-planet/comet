---
"@comet/blocks-admin": patch
---

Fix linking from block preview to block admin for composite + list/blocks/columns block combinations

Previously, the generated route was wrong if a composite contained multiple nested list, blocks or columns blocks.
