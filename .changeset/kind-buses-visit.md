---
"@comet/cms-site": patch
---

Set `referrerPolicy="strict-origin-when-cross-origin"` in the `YouTubeVideoBlock`

Apparently, YouTube recently started requiring a `Referer` header for embedded videos. If no `Referer` is present, the video fails to load ("Error 153").
