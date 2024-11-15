---
"@comet/cms-site": minor
---

Add support to set a custom preview image icon to `DamVideoBlock`, `VimeoVideoBlock`, and `YouTubeVideoBlock`

Use the `previewImageIcon` prop to pass the icon to the default `VideoPreviewImage` component:

```diff
<DamVideoBlock
  data={props}
  fill={fill}
+ previewImageIcon={<CustomPlayIcon />}
/>
```
