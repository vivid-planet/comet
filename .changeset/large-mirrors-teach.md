---
"@comet/cms-site": major
---

Fix an issue where the block preview could break a block's styling and HTML structure

This was caused by a `div` added around every block to enable the selection and highlighting of the block in the block preview.
The `div` is still present but now uses `display: contents`, so its effect should be minimal.

Common issues that should now be resolved include:

-   The image inside, e.g., a `PixelImageBlock`, would not be visible because the image's size depends on the parent `div`'s size.
-   Blocks used as children of elements with `display: flex` or `display: grid` could not position themselves correctly.
