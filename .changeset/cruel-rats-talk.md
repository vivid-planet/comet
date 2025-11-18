---
"@comet/site-react": minor
"@comet/site-nextjs": minor
---

Move `YoutubeVideoBlock`, `VimeoVideoBlock` and `DamVideoBlock` to `@comet/site-react`

The blocks in `@comet/site-react` provide no default implementation for `renderPreviewImage`.
Instead, use the new `VideoPreviewImage` component with the `renderImage` prop to create the preview image.
