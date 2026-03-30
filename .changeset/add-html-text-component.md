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
