---
"@comet/mail-react": minor
---

Add `registerStyles` for component-level responsive CSS

Register CSS styles at module scope via `registerStyles`. Registered styles are automatically rendered as `<mj-style>` elements in `<MjmlHead>` by `MjmlMailRoot`. Styles can be static CSS strings or functions that receive the active theme.
