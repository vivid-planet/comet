---
"@comet/cms-site": major
---

Revise `PixelImageBlock` to correctly use the "new" `next/image` component

See the [docs](https://nextjs.org/docs/pages/api-reference/components/image-legacy#comparison) for a comparison between the new and the legacy component.

**Migrate**

Remove the `layout` prop from the block as it can lead to errors with the default implementation (`layout="responsive"` is not compatible with the new `fill` prop).

-   `layout={"responsive" | "inherit"}` can safely be removed

    ```diff
    <PixelImageBlock
        data={block.props}
        aspectRatio={aspectRatio}
    -   layout={"responsive"}   // line is marked as deprecated, but "responsive" must be removed
        {...imageProps}
    />
    ```

-   `layout={"fill"}` can be replaced with `fill={true}`

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

The `PixelImageBlock` is usually wrapped in a `DamImageBlock` in the application. The `layout` prop should be removed from it as well.

You can use the newly added `fill` prop of the `next/image` component by embedding the `PixelImageBlock` in a parent element that assigns the `position` style. See the [docs](https://nextjs.org/docs/pages/api-reference/components/image#fill) for more information.
