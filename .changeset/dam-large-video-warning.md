---
"@comet/cms-admin": minor
---

Add a warning for videos that are too large to be delivered with good performance

Videos are not optimized before delivery, so large videos can lead to poor performance. A warning is now shown when such a video is uploaded to the DAM, on the DAM file detail page, and in the `DamVideoBlock`.

The threshold defaults to 16 MB and can be configured (or disabled globally) via the new `maxRecommendedVideoFileSize` DAM config option:

```tsx
<CometConfigProvider
    dam={{
        // ...
        maxRecommendedVideoFileSize: 32, // videos larger than 32 MB show the warning
        // maxRecommendedVideoFileSize: false, // disable the warning globally
    }}
>
```
