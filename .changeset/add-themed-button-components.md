---
"@comet/mail-react": minor
---

Add theme support to `MjmlButton` and add a new `HtmlButton` component

`MjmlButton` now supports theme-based styling through `theme.button`, an optional `variant` prop, and a `fullWidth` prop that makes the button span its container. `HtmlButton` provides the same theming for MJML ending tags and other raw-HTML contexts.

- `theme.button` sets the base button styling (color, background, border, border radius, font, and inner padding); `theme.button.variants` overrides those per named variant, optionally with per-breakpoint responsive values
- `theme.button.backgroundImage` (typically a gradient) overlays `backgroundColor`, which stays as the solid fallback for clients that don't render gradients (notably Outlook)
- `HtmlButton` has no alignment prop; horizontal placement is handled by the containing cell or layout
- Existing `MjmlButton` usages are unchanged when no `theme.button` is configured

**Example theme**

```ts
import { createTheme } from "@comet/mail-react";

const theme = createTheme({
    button: {
        borderRadius: "6px",
        padding: "12px 28px",
        defaultVariant: "primary",
        variants: {
            primary: { backgroundColor: "#5B4FC7", color: "#FFFFFF" },
            gradient: {
                backgroundColor: "#5B4FC7",
                backgroundImage: "linear-gradient(to right, #5B4FC7, #FF6B6B)",
                color: "#FFFFFF",
            },
        },
    },
});

declare module "@comet/mail-react" {
    interface ButtonVariants {
        primary: true;
        gradient: true;
    }
}
```

Usage:

```tsx
import { MjmlButton, MjmlMailRoot } from "@comet/mail-react";

<MjmlMailRoot theme={theme}>
    <MjmlSection>
        <MjmlColumn>
            <MjmlButton href="https://example.com">Default</MjmlButton>
            <MjmlButton href="https://example.com" variant="gradient" fullWidth>
                Gradient, full width
            </MjmlButton>
        </MjmlColumn>
    </MjmlSection>
</MjmlMailRoot>;
```
