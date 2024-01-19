---
"@comet/cms-admin": patch
---

Fix bug in the `PixelImageBlock` that caused images not to be displayed in the `EditImageDialog`

Since v5.3.0 we use preview file URLs everywhere in the admin app. The preview file URLs are behind the global guard. Meaning, the request must be routed via the auth proxy. This requires replacing the public API url with the auth proxy URL in the admin block.
