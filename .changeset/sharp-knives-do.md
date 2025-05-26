---
"@comet/cms-site": patch
"@comet/site-nextjs": patch
---

Revert "Fix `PixelImageBlock` fixed height, auto width issue" added in v7.20.0

In v7.20.0, height was set to `100%` for `PixelImageBlock`.
This caused issues when the image was not wrapped, as it would inherit the height of the next parent element instead of maintaining its aspect ratio.
Thus, we are reverting this change to restore the previous behavior.
