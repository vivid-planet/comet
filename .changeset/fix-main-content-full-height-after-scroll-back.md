---
"@comet/admin": patch
---

Fix `MainContent` with `fullHeight` growing past the viewport after returning from a scrolled detail page

`useTopOffset` used `getBoundingClientRect().top`, which is viewport-relative. When navigating back from a scrolled page, the browser could restore the previous scroll position before the offset was measured, producing a too-small offset and a `calc(100vh - topOffset)` larger than the viewport. The offset is now measured relative to the document by adding `window.scrollY`.
