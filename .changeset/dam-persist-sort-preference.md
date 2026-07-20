---
"@comet/cms-admin": patch
---

Persist the DAM sorting preference across sessions

The Digital Asset Management asset list now remembers the selected sorting (column and direction) in `localStorage` instead of resetting to alphabetical (`name` ascending) on every visit.
