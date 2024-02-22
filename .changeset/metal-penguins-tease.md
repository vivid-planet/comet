---
"@comet/cms-admin": patch
---

Prevent the document editor from losing its state when (re)gaining focus

In v5.6.1 a loading indicator was added to the document editor (in `PagesPage`). 
This had an unwanted side effect: Focusing the edit page automatically causes a GraphQL request to check for a newer version of the document. This request also caused the loading indicator to render, thus unmounting the editor (`EditComponent`). Consequently, the local state of the editor was lost.
