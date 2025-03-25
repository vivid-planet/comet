---
"@comet/cms-admin": minor
---

Add all supported `video/` mimetypes to allowedMimetypes of `DamVideoBlock`

Per default, following mimetypes are now allowed: `video/mp4`, `video/webm`, `video/ogg`, `video/quicktime`.
This list can be extended in the project via the `acceptedMimetypes` prop of the `DamConfigProvider`.
