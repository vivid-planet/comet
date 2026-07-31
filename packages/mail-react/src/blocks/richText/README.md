# RichText block

Renders CMS RichText block data (draft-js raw content) in emails. Email templates need to style each draft block type — a `header-one` as a heading, a `paragraph-standard` as body text — and that mapping differs per application, so it is configured per `createRichTextBlock` call rather than shipped with the package.

## Nesting

A list level at a draft depth above zero renders inside the enclosing item's text cell, which is what makes its indent compound and its text styles come from the enclosing text component rather than from a variant of its own.

Every table names its nesting level with the modifier `richTextBlock__list--depth<Level>`, and a nested one carries `richTextBlock__list--nested` as well. The two are redundant on purpose. A depth selects one level, which repeated `--nested` ancestors can only express as "that level and deeper"; `--nested` selects every level below the outermost, which depths can only express by enumerating them or by negating depth zero.

## Non-goals

- No custom block or entity renderers. Block and link markup is controlled by the package; the factory configures only how block types are styled, how link types resolve to URLs, and how inline styles render.
