---
"@comet/mail-react": minor
---

Add `HtmlImage` component

Renders an `<img>` tag that adapts to its container width below the default breakpoint. Use within raw HTML context — HTML-only emails or MJML ending tags like `MjmlRaw`.

```tsx
import { HtmlImage } from "@comet/mail-react";

<HtmlImage src="https://example.com/banner.png" width="600" height="300" alt="Banner" />;
```
