---
"@comet/blocks-admin": major
"@comet/cms-site": major
"@comet/cms-api": major
---

Removed `aspectRatio` from `YouTubeBlock`

Attention: the site implementation of the `YouTubeBlock` needs an aspect ratio. The aspect ratio can now be set via the optional `aspectRatio` property of the `YouTubeBlock`, fallback is `16x9`.
