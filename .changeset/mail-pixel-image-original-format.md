---
"@dextinity/mail-react": patch
---

Fix broken images in classic Outlook for Windows in `MjmlPixelImageBlock` and `HtmlPixelImageBlock`

Classic Outlook for Windows can't display WebP.
The API chooses WebP when the `Accept` header of the image request allows it, and CDNs that ignore `Vary: Accept` then serve the cached WebP image to every email client.
Both blocks now request DAM images in their original format.

Requires `@dextinity/cms-api` with support for the `format:original` image URL segment.
