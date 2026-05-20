---
"@comet/site-react": major
"@comet/site-nextjs": major
---

Remove `defaultTipTapMarkMapping` and `defaultTipTapNodeMapping` exports. The defaults are now always merged with any passed `nodeMapping`/`markMapping` in `renderTipTapRichText`, so consumers only need to provide their overrides instead of spreading the defaults.
