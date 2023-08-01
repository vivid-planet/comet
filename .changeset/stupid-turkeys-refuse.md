---
"@comet/cms-api": minor
---

Add updatedAt timestamp to page tree

Adds an updatedAt timestamp to the page tree node that is infered from the attached documents. This timestamp can be used to sort the page tree. One common use case is the "Latest Content Updates" widget, which can now be limited to the current content scope.

Note: The updatedAt timestamp is set to the current time when the migration is executed. You will need to write an additional migration if you want the timestamp to reflect the updatedAt timestamp of the active attached document.
