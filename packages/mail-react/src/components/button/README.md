# Button

`theme.button` gives buttons named, reusable styles plus variants — a project defines its button look once and applies it by name.

## Non-goals

- No style re-application for Outlook. Unlike `Text` and `InlineLink`, the button styles its anchor directly, so it has nothing to re-apply against Outlook's link overrides.
- No alignment prop on `HtmlButton`. Do not add one for parity with `MjmlButton` — horizontal placement is the layout's job.
- No `fontFamily` in `defaultButtonStyles`. Do not add one; the button inherits the font from `theme.text` so it blends with surrounding text, and a button default would override that.
