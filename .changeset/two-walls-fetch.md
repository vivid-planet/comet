---
"@comet/cms-admin": minor
"@comet/cms-site": minor
"@comet/cms-api": minor
---

Add preview image to `YouTubeVideoBlock` and `DamVideoBlock`

The `YouTubeVideoBlock` and the `DamVideoBlock` do now support a preview image out of the box. For customisation the default `VideoPreviewImage` component can be overridden with the optional `renderPreviewImage` method.

It is recommended to replace the custom implemented video blocks in the projects with the updated `YouTubeVideoBlock` and `DamVideoBlock` from the library.
