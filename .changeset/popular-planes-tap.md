---
"@comet/blocks-admin": major
"@comet/cms-admin": major
"@comet/blocks-api": major
"@comet/cms-api": major
---

Move `YouTubeVideoBlock` to `@cms` packages

**Migrate**

```diff
- import { YouTubeVideoBlock } from "@comet/blocks-admin";
+ import { YouTubeVideoBlock } from "@comet/cms-admin";
```

```diff
- import { YouTubeVideoBlock } from "@comet/blocks-api";
+ import { YouTubeVideoBlock } from "@comet/cms-api";
```
