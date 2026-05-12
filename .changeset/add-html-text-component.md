---
"@comet/mail-react": minor
---

Add `HtmlText` component for rendering themed text inside MJML ending tags or outside of the MJML context

```tsx
import { HtmlText } from "@comet/mail-react";

const MyText = () => (
    <MjmlRaw>
        <table>
            <tr>
                <HtmlText variant="heading" bottomSpacing>
                    Heading inside raw HTML
                </HtmlText>
            </tr>
        </table>
    </MjmlRaw>
);
```

Supports an optional `element` prop to render as any HTML element instead of the default `<td>`.

```tsx
<HtmlText element="div">Rendered as a div</HtmlText>
<HtmlText element="a" href="/link">Rendered as an anchor</HtmlText>
```
