---
"@dextinity/cms-api": minor
---

Add `getBlockInputJsonSchema` to describe a block's input as a JSON Schema

The schema describes the input a block's `blockInputFactory` accepts, for instance to let an AI agent produce block input. It's derived from the block's input meta, with referenced blocks put in `$defs`.

A block whose input the meta can't describe provides its own schema with the new optional `blockInputJsonSchema` property. The TipTap rich text block does so, describing the content its options allow: text blocks and their styles, lists, marks, inline styles, placeholders, links, child blocks and the `maxTextBlocks` and `listLevelMax` limits.

Validate the input nonetheless, since not every validation rule of a block can be expressed in the schema.

**Example**

```ts
const schema = getBlockInputJsonSchema(PageContentBlock);
```
