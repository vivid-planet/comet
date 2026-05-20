---
"@comet/site-react": patch
---

Fix `VimeoVideoBlock` not autoplaying on initial page load when `autoplay` is enabled and no `previewImage` is set

Without a `previewImage`, the iframe URL was missing `autoplay=1` and playback relied on a `postMessage("play")` fired from the `IntersectionObserver` callback. That message raced against the Vimeo player's initialization inside the iframe — when it arrived first the message was dropped and the video stayed paused, while the `PlayPauseButton` optimistically showed the "Pause" state, requiring two clicks to recover. `autoplay=1` is now appended whenever `autoplay` is enabled so Vimeo handles autoplay natively. The existing `muted=1` param satisfies the browser autoplay policy.
