---
"@comet/cms-site": minor
---

PixelImageBlock: Set `object-fit` to `cover` per default

When setting `object-fit` to `cover`, the image will fill the container and maintain its aspect ratio.
This is the most common use case for images in our applications.
The default behavior for `object-fit` (which is `fill`) resulted in distorted images.

This behavior can be overridden by setting the `style` prop on the `PixelImageBlock` component, which is forwarded to the `next/image` component:

```diff
<PixelImageBlock
  ...
  fill
+ style={{ objectFit: "contain" }}
/>
```
