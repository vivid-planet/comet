---
"@comet/cms-admin": minor
---

Support rendering blocks read-only via a `ReadOnlyBlockRenderInterface` capability

A block that implements this capability can render its saved state without an editing UI, so saved content can be shown where editing is not wanted. The experimental TipTap rich text block implements it.
