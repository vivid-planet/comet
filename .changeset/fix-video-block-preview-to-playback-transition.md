---
"@comet/site-react": patch
---

Fix preview-image to playback transition in video blocks

- `DamVideoBlock`: clicking the preview image's play button now starts video playback. Previously, the click dismissed the preview but the browser's autoplay policy blocked playback of videos with sound because the gesture happened on the preview image rather than the `<video>` element. Playback is now triggered explicitly inside the ref callback to stay within the user gesture window.
- `YouTubeVideoBlock` / `VimeoVideoBlock`: when the preview image is dismissed, `isPlaying` is now set to `true` so `PlayPauseButton` shows the correct icon, and the playback is flagged as manually handled so the viewport handler does not immediately pause the video.
