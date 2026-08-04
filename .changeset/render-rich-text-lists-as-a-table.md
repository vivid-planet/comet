---
"@comet/mail-react": patch
---

Fix inconsistent spacing of rich-text lists across email clients by rendering each list as a table instead of `<ul>` / `<ol>`

- `richTextBlock__listItem` is now a `<tr>` instead of an `<li>`, so margin and padding set on it no longer apply. Every row but the last carries `richTextBlock__listItem--itemSpacing`, with the spacing on its cells.
- List cells restate the text styles inline, so a rule targeting list text needs `!important`. The cells carry `richTextBlock__listItemMarker` and `richTextBlock__listItemText`.
- The table carries a modifier naming its text variant, such as `richTextBlock__list--variantBody`, and one naming its list type, `richTextBlock__list--ordered` or `richTextBlock__list--unordered`.
