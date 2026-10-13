---
"@dextinity/cms-admin": patch
---

Fix the empty line after a list at the end of a TipTap rich text that couldn't be deleted

The editor no longer adds an empty text block after a list at the end of the content. Deleting this empty line added it again right away. To continue writing after the list, press Enter in its empty last item.
