---
"@comet/mail-react": minor
---

Add `HtmlPixelImageBlock` and `MjmlPixelImageBlock` for rendering Comet CMS `PixelImageBlockData` in emails

Configure `MjmlMailRoot.config.pixelImageBlock` once with the API's allowed image sizes and base URL; the blocks resolve the render width and build the image URL.

Pass `aspectRatio` (e.g. `"16x9"`) to override the DAM crop ratio.

```tsx
<MjmlMailRoot
    config={{
        pixelImageBlock: {
            validSizes: [...cometConfig.images.imageSizes, ...cometConfig.images.deviceSizes],
            baseUrl: process.env.API_URL,
        },
    }}
>
    <MjmlPixelImageBlock data={pixelImageData} width={536} />
</MjmlMailRoot>
```
