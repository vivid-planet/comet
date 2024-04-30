---
"@comet/cms-site": major
---

Require `aspectRatio` prop for `PixelImageBlock` and `Image`

The `16x9` default aspect ratio has repeatedly led to incorrectly displayed images on the site.
Therefore, it has been removed.
Instead, consider which aspect ratio to use for each image.

**Example**

```diff
<PixelImageBlock
  data={teaser}
  layout="fill"
+ aspectRatio="16x9"
/>
```
