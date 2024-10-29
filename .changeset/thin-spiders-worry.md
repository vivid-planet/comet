---
"@comet/cms-site": patch
---

Render preview skeletons of image and video blocks with the block's `aspectRatio` or `height`, if defined, instead of using a fixed height of `300px`

This applies to `DamImageBlock`, `SvgImageBlock`, `PixelImageBlock`, `DamVideoBlock`, `YouTubeVideoBlock`, and `VimeoVideoBlock`.
