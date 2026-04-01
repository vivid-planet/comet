---
"@comet/mail-react": minor
---

Add `HtmlInlineLink` component

Renders an `<a>` tag that inherits text styles from the surrounding `HtmlText` or `MjmlText` component, working around Outlook Desktop's built-in "Hyperlink" character style that overrides natural CSS inheritance with blue color and Times New Roman.

```tsx
<MjmlText>
    Visit our <HtmlInlineLink href="https://example.com">website</HtmlInlineLink> for details.
</MjmlText>
```
