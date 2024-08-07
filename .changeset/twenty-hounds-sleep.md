---
"@comet/cms-site": minor
---

Add `object-fit: cover;` to `PixelImageBlock`.

When an image is set to `object-fit: cover;`, it will fill the container and maintain its aspect ratio. This is the most common use case for images in our CMS.

When we need to display an image for a fixed height, we can use the `fill` prop on the `PixelImageBlock` component to fit the image to the container. The image will be loaded with the given aspect ratio and cropped to fit the container. The default behavior for the `object-fit` is `fill` which resulted in distorted images.

This behavior can be overridden by setting the `style` prop on the `PixelImageBlock` component, which is forwarded to the next image.

```
 <PixelImageBlock ... fill style={{ objectFit: "contain" }} />
```
