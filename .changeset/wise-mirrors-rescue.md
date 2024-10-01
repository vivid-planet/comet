---
"@comet/cms-site": patch
---

Prevent rendering of blocks without content

In order to prevent rendering empty blocks in site and cause unwanted placeholders, the `PreviewSkeleton` returns children only if the wrapped block has content.
For instance, an empty rich text block would still render a HTML tag.
