# Text

MJML has no built-in way to define and reuse responsive, named text styles. Theme variants (heading, body, legal, …) are declared once in the theme and picked per usage with a single `variant` prop, so style values don't have to be repeated across templates. `MjmlText` is the body-level component and stays a pass-through to the base when no theme is present; `HtmlText` is the equivalent for MJML ending tags and other raw-HTML contexts and requires a theme. Both also republish the resolved font and color values to descendants so inline links can re-assert them — Outlook's Word renderer would otherwise override a bare `<a>` and break inheritance.

## Non-goals

- Not a heading component. Heading semantics (size, weight, spacing) are expressed as theme variants on the same text components, not as separate elements.
