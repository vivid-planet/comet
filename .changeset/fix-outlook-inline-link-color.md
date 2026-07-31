---
"@comet/mail-react": patch
---

Fix inline links losing their color in Outlook on Windows

`HtmlInlineLink` rendered blue in Outlook on Windows instead of matching the text around it, unless the theme set a base text color. The base text theme now defines one, so links match without any configuration.

As a result, a text color set through the `MjmlMailRoot` `attributes` slot no longer applies — set it on `theme.text` or on a text variant instead.
