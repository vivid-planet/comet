---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add `listLevelMax` option to `createTipTapRichTextBlock` that limits the maximum nesting depth of list items

The option works similar to `maxBlocks`:

- **API**: Validates that stored content doesn't exceed the maximum list nesting depth
- **Admin**: Prevents further indentation via Tab key and toolbar button when at max depth, and trims deeply nested lists when pasting content
