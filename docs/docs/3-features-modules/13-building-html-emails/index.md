---
title: Building HTML Emails
---

`@comet/mail-react` lets you build responsive, themed HTML emails using React components. Under the hood it uses [MJML](https://documentation.mjml.io/) to generate cross-client-compatible HTML. On top of the raw MJML components the library provides a theme system, higher-level wrapper components, a style utility layer, and Storybook integration for live previewing emails during development.

:::tip 🤖 Agent Skill `dx-mail-react`
An agent skill for building HTML emails with `@comet/mail-react` is available. It provides AI coding agents with email development best practices, component patterns, and cross-client compatibility guidance. See [Installing Agent Skills](../../4-guides/5-installing-agent-skills.md) for setup instructions.
:::

:::info
If you're looking for the server-side mail template system that handles template registration, dependency injection, and sending — see [Mail Templates Module](../12-mail-templates-module/index.md). `@comet/mail-react` focuses on building the email markup itself and integrates with the Mail Templates Module via `renderMailHtml`.
:::

## Installation

```bash
npm install @comet/mail-react
```

- **`react`** is a required peer dependency
- **`storybook`** is an optional peer dependency — only needed for the Storybook addon

MJML (`mjml` and `mjml-browser`) is bundled as a regular dependency — no separate install needed.

## Storybook Setup

Add the addon to your `.storybook/main.ts`:

```ts title=".storybook/main.ts"
const config = {
    addons: [
        // ... other addons
        "@comet/mail-react/storybook",
    ],
};
```

This single entry auto-configures:

- A **decorator** that wraps each story in `MjmlMailRoot`, converts the MJML to HTML, and displays the rendered email
- A **Copy Mail HTML** toolbar button for copying the rendered email HTML to the clipboard
- A **Use Public Image URLs** toolbar toggle that replaces image sources with public placeholder URLs — useful for testing on external services (e.g., Litmus, Email on Acid) that cannot reach `localhost`
- An **MJML Warnings** panel for debugging validation issues

## Your First Email

The Storybook decorator handles `MjmlMailRoot` automatically, so stories only need to define the email content:

```tsx title="src/stories/MyFirstMail.stories.tsx"
import { MjmlColumn, MjmlSection, MjmlText } from "@comet/mail-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const config: Meta = {
    title: "Mails/MyFirstMail",
};

export default config;

export const Basic: StoryObj = {
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlText>Hello from my first email!</MjmlText>
            </MjmlColumn>
        </MjmlSection>
    ),
};
```

### The MJML Layout Model

MJML enforces a **section → column → content** structure:

- **`MjmlSection`** — a full-width horizontal row
- **`MjmlColumn`** — divides a section into vertical columns (stacking on mobile)
- **Content components** (`MjmlText`, `MjmlImage`, `MjmlButton`, …) — must be placed inside a column

The `indent` prop on `MjmlSection` adds theme-based left/right padding so content doesn't touch the email edges. See [Email Basics](./1-email-basics.md) for more on the layout model and nesting rules.

## Rendering Emails

In Storybook, the decorator handles MJML-to-HTML conversion automatically. When rendering the final HTML to send, use the `renderMailHtml` function — see [Rendering](./3-rendering.md) for full details and integration examples.

## Next Steps

- [**Email Basics**](./1-email-basics.md) — Layout rules, nesting requirements, and when to use MJML vs HTML components
- [**Components and Theme**](./2-components-and-theme.md) — Full theme API, text variants, responsive values, and all available components
- [**Rendering**](./3-rendering.md) — Converting email templates to HTML with `renderMailHtml`, browser environments, and Mail Templates Module integration
- [**Customization**](./4-customization.md) — Creating custom components, extending the theme with module augmentation, and adding responsive styles
