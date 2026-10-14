---
"@dextinity/cms-api": patch
---

Return one search text entry per text block in `createTipTapRichTextBlock`

Previously, `searchText()` returned one entry per TipTap text node. Since TipTap splits a line into several text nodes wherever a mark such as bold, italic or a link starts or ends, a single sentence ended up as several entries. Consumers that join the entries with spaces got stray spaces, for instance before a period following a link.

Now `searchText()` returns one entry per paragraph or heading, like the DraftJS-based rich text block. A hard break within a text block becomes a newline.
