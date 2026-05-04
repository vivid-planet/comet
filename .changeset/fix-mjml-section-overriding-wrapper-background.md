---
"@comet/mail-react": patch
---

Fix `MjmlSection` overriding `MjmlWrapper`'s background

When rendered inside a custom `MjmlWrapper`, `MjmlSection` no longer applies its theme-default `backgroundColor`, so the wrapper's background is now visible through its sections. An explicit `backgroundColor` prop on `MjmlSection` still takes precedence. Sections rendered outside of a wrapper continue to receive the theme default as before.
