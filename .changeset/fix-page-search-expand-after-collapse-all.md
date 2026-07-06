---
"@comet/cms-admin": patch
---

Fix page search not expanding the tree when navigating between matches after "Collapse all"

Previously, jumping to the next or previous search match only scrolled to the match without expanding its collapsed ancestors. After collapsing the tree via "Collapse all" during an active search, continuing the search revealed nothing. Navigating between matches now re-expands the current match's ancestors before scrolling to it.
