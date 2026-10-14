---
"@dextinity/cms-api": minor
---

Add the `includeFormatExtensionInImageUrls` option to include a file extension in DAM image URLs

CDN features that cache an image per format, such as Cloudflare's [Vary for Images](https://developers.cloudflare.com/cache/advanced-configuration/vary-for-images/) or the WebP option of Bunny's [Vary Cache](https://bunny.net/docs/cdn/vary-cache), require the file extension in the URL path.
With the option enabled, image URLs end with the extension of the format the API delivers when the `Accept` header offers no modern format, e.g. `photo.png`.
Originals that aren't JPEG, PNG or GIF get `.jpg`, because the API delivers them as JPEG.
Image URLs with an outdated filename, i.e. without extension or from before the file was renamed, permanently redirect to the current URL.

The API accepts image URLs with and without extension regardless of the option, so disabling it again doesn't break URLs that are already in use.

**Example**

```ts
DamModule.register({
    damConfig: {
        // ...
        includeFormatExtensionInImageUrls: true,
    },
    // ...
});
```
