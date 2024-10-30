---
"@comet/cms-site": minor
---

Allow setting a custom `height` or `aspectRatio` on `PreviewSkeleton` when using `type="media"`

When no value is provided, the fallback height of `300px` is used.

```tsx
<PreviewSkeleton type="media" height={200} />
<PreviewSkeleton type="media" aspectRatio="16x9" />
```
