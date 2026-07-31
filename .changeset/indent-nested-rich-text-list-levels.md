---
"@comet/mail-react": minor
---

Support nesting by draft depth in the RichText block's lists

A level below the top one used to leave an unprocessed `mj-text` tag in the compiled mail, and put the text variant's block spacing below its own last item. Each level now renders as a table inside the enclosing item's text cell, so `theme.list.indent` compounds per level.

Every level draws the marker of its own list type and takes its text styles from the text component the outermost list renders in. A nested table therefore carries no variant modifier, so a rule scoped to the outermost list's variant reaches every level.

For per-level rules, every list table names its nesting level with `richTextBlock__list--depth<Level>`, counting the outermost as zero, and a nested one additionally carries `richTextBlock__list--nested`:

```ts
registerStyles(
    css`
        /* The second level only */
        .richTextBlock__list--depth1 > tbody > tr > .richTextBlock__listItemText {
            font-size: 14px !important;
        }
        /* Every level below the outermost */
        .richTextBlock__list--nested > tbody > tr > .richTextBlock__listItemMarker {
            padding-left: 4px !important;
        }
    `,
    { inline: true },
);
```
