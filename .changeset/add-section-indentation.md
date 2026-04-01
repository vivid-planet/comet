---
"@comet/mail-react": minor
---

Add `indent` prop to `MjmlSection` for content indentation

`MjmlSection` now accepts an optional `indent` boolean prop that applies left/right padding based on `theme.sizes.contentIndentation`. The default indentation is applied as inline padding, with responsive overrides via registered media queries.
