---
"@comet/mail-react": minor
---

Add `HtmlText` component for rendering themed text inside MJML ending tags

`HtmlText` renders a `<td>` element with inline styles derived from the text theme. It supports the same variants, responsive values, and `bottomSpacing` as `MjmlText`, but is designed for use inside MJML ending tags (`mj-raw`, `mj-table`) where MJML components cannot be used.

**Example**

```tsx
import { HtmlText } from "@comet/mail-react";

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
