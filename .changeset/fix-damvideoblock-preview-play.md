---
"@comet/site-react": patch
---

Fix video blocks not starting playback / button state out of sync after clicking the preview image

In `DamVideoBlock`, clicking the play button on the preview image dismissed the image but did not start the video, because the browser's autoplay policy blocks autoplay of videos with sound without a direct gesture on the video element. Playback is now started imperatively from the user's click.

In `YouTubeVideoBlock` and `VimeoVideoBlock`, the `PlayPauseButton` stayed in the "play" state and the viewport handler could immediately pause the video after the preview image was dismissed. The playing/manual-handling state is now updated consistently.
