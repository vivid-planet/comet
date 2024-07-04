---
"@comet/blocks-admin": major
"@comet/cms-admin": major
"@comet/blocks-api": major
"@comet/cms-site": major
"@comet/cms-api": major
---

Revise video blocks.

- add preview image to video blocks
- move `YouTubeVideoBlock` to `@cms` packages

The `YouTubeVideoBlock` and the `DamVideoBlock` do now support a preview image out of the box. For customisation the default `VideoPreviewImage` component can be overridden with the optional `renderPreviewImage`.

**Migrate**

```diff
- import { YouTubeVideoBlock } from "@comet/blocks-admin";
+ import { YouTubeVideoBlock } from "@comet/cms-admin";
```

```diff
- import { YouTubeVideoBlock } from "@comet/blocks-api";
+ import { YouTubeVideoBlock } from "@comet/cms-api";
```

