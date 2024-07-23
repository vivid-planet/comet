---
"@comet/blocks-admin": major
"@comet/cms-site": major
"@comet/cms-api": major
---

Remove `aspectRatio` from `YouTubeBlock`

The block's aspect ratio options (4x3, 16x9) proved too inflexible to be of actual use in an application. Therefore, the aspect ratio field was removed. It should be defined in the application instead.

**Migrate**

The block requires an aspect ratio in the site. It should be set using the `aspectRatio` prop (default: `16x9`):

```diff
 <YouTubeVideoBlock
   data={video}
+  aspectRatio="9x16"
 />
```
