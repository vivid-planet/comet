---
"@comet/cms-admin": patch
"@comet/cms-api": patch
---

Remove `video/avi`, `image/psd` and `video/x-m4v` from default accepted mimetypes

None of this mimetypes had an actual impact:

- `video/avi` doesn't actually exist
- `image/psd` doesn't exist / is non-standard
- `video/x-m4v` is a niche format and the mimetype is not widely used (e.g., Google Chrome and MacOS use `video/mp4`
  instead)

So removing them shouldn't have any noticeable effects.
