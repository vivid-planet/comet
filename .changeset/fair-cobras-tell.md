---
"@comet/admin": minor
---

Add `fullHeight` & `disablePadding` props to MainContent

`fullHeight` makes MainContent take up the remaining space below to fill the entire page.
This is helpful for virtualized components that need a fixed height, such as DataGrid or the PageTree.

`disablePadding` is helpful if a component requires the `fullHeight` behaviour but should fill the entire page without the surrounding space.
