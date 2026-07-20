---
"@comet/cms-admin": minor
---

Warn editors when videos that are too large for performant delivery are used

Videos are delivered without optimization, so large videos can lead to poor loading performance. A warning is now shown when a video exceeds a configurable file size:

- as a snackbar after uploading it to the DAM
- as an alert on the DAM asset detail page
- as an alert in the `DamVideoBlock` when such a video is selected

The threshold defaults to 10 MB and can be configured (or the warning disabled entirely) via the new `videoPerformanceWarningFileSize` option in the `dam` config:

```tsx
<CometConfigProvider
    dam={{
        // ...
        videoPerformanceWarningFileSize: 25, // warn for videos larger than 25 MB
        // or set to `false` to disable the warning globally
    }}
>
```
