# MjmlWrapper

Solves the issue that grouping multiple sections under a shared background — the reason `mj-wrapper` exists in MJML — does not work when sections paint their own themed background on top. `MjmlWrapper` owns the shared background (defaulting to the theme's content background, overridable by an explicit prop) and signals its descendants that the wrapper is responsible for the background, so sections inside it skip their own default.

## Dependencies

- [MjmlSection](../section/README.md) — cooperates by suppressing its own themed background default when rendered inside a wrapper.
