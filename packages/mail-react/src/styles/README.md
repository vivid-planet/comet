# Styles

A custom component rendered in the email body often needs CSS in the email head (typically media queries, since clients like Outlook ignore head styles for the inline-first content). Without coordination, each component would have to ask its parent to hoist a `<MjmlStyle>` for it. `registerStyles` solves this by letting any module declare its head CSS once, at module-evaluation time, into a process-wide registry; `MailRoot` then renders the whole registry inside `<MjmlHead>` regardless of which components the tree actually uses.

## Dependencies

- [theme](../theme/README.md) — function-form payloads are resolved against the active theme at render time, so registered CSS can reference theme tokens (breakpoints, colors, spacing).
- `css` tagged template (in `src/utils/`) — the payload type; using it gives IDE syntax highlighting for the registered CSS string.
