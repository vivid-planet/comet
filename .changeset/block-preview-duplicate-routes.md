---
"@dextinity/site-react": patch
---

Fix the selection in the block preview for blocks that a page renders more than once

When one copy of such a block unmounted, the other copies could not be selected in the block preview until it was reloaded.
