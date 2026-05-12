---
"@comet/mail-react": minor
---

Add `renderMailHtml` function via `/server` and `/client` sub-path exports

The new `renderMailHtml` function handles the full React → MJML → HTML pipeline in a single call, returning `{ html, mjmlWarnings }`.
Use `@comet/mail-react/server` in Node.js environments and `@comet/mail-react/client` in browser environments.

**Example**

```ts
// In a Node.js context (e.g. email sending service):
import { renderMailHtml } from "@comet/mail-react/server";

const { html, mjmlWarnings } = renderMailHtml(<MyEmail />);
```

```ts
// In a browser context (e.g. Storybook, preview):
import { renderMailHtml } from "@comet/mail-react/client";

const { html, mjmlWarnings } = renderMailHtml(<MyEmail />);
```
