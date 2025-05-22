---
"@comet/cms-site": patch
---

Bug fix: revert "Fix PixelImageBlock fixed height, auto width issue" - The commit has an issue: when no div is wrapped around the image, it uses the height of the next parent.
