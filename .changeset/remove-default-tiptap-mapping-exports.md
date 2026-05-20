---
"@comet/site-react": major
"@comet/site-nextjs": major
---

Remove `defaultTipTapMarkMapping` and `defaultTipTapNodeMapping` exports. The defaults are now applied automatically in `renderTipTapRichText` when `nodeMapping` or `markMapping` are not provided.
