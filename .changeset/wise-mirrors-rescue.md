---
"@comet/cms-site": patch
---

Prevent rendering of empty blocks in `PreviewSkeleton`

Previously, in non-preview environments, `PreviewSkeleton` would still render its children, even if `hasChanges` was set to `false`, causing unwanted empty HTML tags in the site.
For instance, an empty rich text block would still render a `<p>` tag.
Now, the children will only be rendered if `hasContent` is set to `true`.
Doing so removes the need for duplicate empty checks.
