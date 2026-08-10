---
"@comet/mail-react": patch
---

Fix crash in the RichText block when it starts with a nested list item

An editor produces this by pressing Tab on the first item of a list, or by clearing the text of the item above a nested one.
