---
"@comet/cms-admin": patch
"@comet/cms-api": patch
---

Fix `FileField` breaking image block selection

The `DamFileFieldFile` fragment lost the image dimensions (`width`, `height`, `cropArea`) needed by `DamImageBlock`/`PixelImageBlock`. Selecting an image inside an image block crashed because those fields were missing. Restored them on the fragment.

Composing the fragment into a parent collection (e.g. a many-to-many to `DamFile`) exposed a Mikro-ORM gotcha: `Collection.loadItems()` does not honor `eager: true`, so each loaded `DamFile` had an uninitialized `image` Reference and GraphQL threw `Cannot return null for non-nullable field DamFileImage.width`. Added an `image` `@ResolveField` on `FilesResolver` that initializes the Reference if needed, so consumers don't have to remember to populate it.
