---
"@comet/mail-react": minor
---

Add Storybook addon preset at `@comet/mail-react/storybook`

Consumers add a single line to `.storybook/main.ts` to get a complete mail development setup:

```ts
const config: StorybookConfig = {
    addons: ["@comet/mail-react/storybook"],
};
```

The preset auto-registers:

- A **mail renderer decorator** that wraps stories in `<MjmlMailRoot>` and renders them to HTML
- A **"Copy Mail HTML"** toolbar button to copy the rendered email HTML to the clipboard
- A **"Use public image URLs"** toggle to replace image sources with public placeholder URLs (useful for testing on external services like Email on Acid)
- An **"MJML Warnings"** panel showing validation warnings with a badge count
