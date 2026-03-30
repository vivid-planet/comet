---
"@comet/mail-react": minor
---

Add `HtmlText` component

A themed text component that renders a `<td>` element with inline styles derived from the text theme. Use it inside MJML ending tags (e.g., `MjmlRaw`) and custom HTML table layouts where MJML components cannot be used.

`HtmlText` supports the same `variant` and `bottomSpacing` props as `MjmlText`, reusing the existing text theme configuration. Responsive variant overrides are registered as CSS media queries with `htmlText--*` class selectors.

**Example**

```tsx
<MjmlRaw>
    <table>
        <tr>
            <HtmlText variant="heading" bottomSpacing>
                Heading inside raw HTML
            </HtmlText>
        </tr>
    </table>
</MjmlRaw>
```
