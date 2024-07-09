---
"@comet/blocks-api": patch
---

Fix validation of `YouTubeVideoBlock`

Previously, the validation of the `YouTubeVideoBlock` differed between admin and API.
The admin allowed YouTube URLs and YouTube video IDs.
The API only allowed URLs but blocked video IDs.

Now, the API validation also accepts URLs and video IDs.
