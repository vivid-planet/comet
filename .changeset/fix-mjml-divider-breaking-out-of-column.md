---
"@comet/mail-react": patch
---

Fix `MjmlDivider` breaking the surrounding layout

A section or column that came after the one holding an `MjmlDivider` rendered outside its wrapper or group instead of inside it. In a section using `disableResponsiveBehavior` (which keeps its columns side-by-side on mobile instead of stacking), the columns' shared wrapper broke, so the following column stacked anyway. In an `MjmlWrapper`, the background stopped after the section holding the divider, so every section below it lost the background.

`MjmlDivider` now wraps its divider `<table>` in an extra row and cell. The class names stay on the `<table>`, so descendant selectors still match — but a selector using a direct-child combinator that expected the table to sit immediately inside the column will need updating, since there's now a `<tr><td>` in between.
