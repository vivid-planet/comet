---
"@comet/mail-react": minor
---

Add Storybook utilities via `/storybook-manager` and `/storybook-preview` sub-path exports

`@comet/mail-react/storybook-preview` exports a `MailRendererDecorator` that handles the full MJML render pipeline — wrapping stories in `<MjmlMailRoot>`, rendering to HTML, and displaying the result. It also supports replacing image sources with public placeholder URLs for testing on external devices.

`@comet/mail-react/storybook-manager` exports a `registerMailStorybookAddons()` function that registers three addons: a "Copy Mail HTML" toolbar button, a "Use public image URLs" toggle, and an "MJML Warnings" panel.

**Example setup**

```ts
// .storybook/manager.tsx
import { registerMailStorybookAddons } from "@comet/mail-react/storybook-manager";

registerMailStorybookAddons();
```

```ts
// .storybook/preview.tsx
import { MailRendererDecorator } from "@comet/mail-react/storybook-preview";

const preview = {
    decorators: [MailRendererDecorator],
};

export default preview;
```
