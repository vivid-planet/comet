---
"@comet/cms-site": major
---

Revise `PixelImageBlock` to correctly use the updated next image component (remove deprecated layout prop)

**Migrate**

The block does not use the `layout` prop anymore, and it must be removed from the block's props because it can lead to an error with the current implementation of `PixelImageBlock`. (`layout="responsive"` is not compatible with the new prop `fill`, which we use as default behavior now) 

`layout={"responsive" | "inherit"}` can safely be removed.

```diff
<PixelImageBlock 
    data={block.props}
    aspectRatio={aspectRatio}
-   layout={"responsive"}   // line is marked as deprecated, but "responsive" must be removed 
    {...imageProps} 
/>
```

`layout={"fill"}` can be replaced with `fill={true}`

```diff
<PixelImageBlock 
    data={block.props}
    aspectRatio={aspectRatio}
-   layout={"fill"}
+   fill
    {...imageProps} 
/>
```

Notes: 

The `PixelImageBlock` is often wrapped in a `DamImageBlock`, the `layout` prop should be removed from the `PixelImageBlock` and all its usages.

If you want to use the added `fill` prop of the next/image component you can do that and embed the `PixelImageBlock` in a necessary container for customization (https://nextjs.org/docs/pages/api-reference/components/image#fill).
