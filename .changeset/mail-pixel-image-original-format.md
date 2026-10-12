---
"@dextinity/mail-react": minor
---

Add `disableModernImageFormats` prop to `MjmlPixelImageBlock` and `HtmlPixelImageBlock`

By default, the API delivers a modern image format like WebP when the `Accept` header of the image request allows it.
In emails, an image proxy often makes that request, not the email client that displays the image.
Set `disableModernImageFormats` to always request the image in its original format:

```tsx
<MjmlPixelImageBlock data={data} width={600} disableModernImageFormats />
```

Requires `@dextinity/cms-api` with support for the `format:original` image URL segment.
