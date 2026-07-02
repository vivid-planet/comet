---
"@comet/mail-react": minor
---

Add `HtmlDivider` component for rendering a themed divider inside MJML ending tags or outside the MJML context

`HtmlDivider` reads `height`, `backgroundColor`, and `backgroundImage` from `theme.divider`, and supports named variants with per-breakpoint responsive overrides — the same shape as `theme.text`. Per-instance `height`, `backgroundColor`, and `backgroundImage` props override the resolved theme/variant values. A `backgroundImage` (typically a gradient) overlays the bar while `backgroundColor` stays as the solid fallback for clients that don't render gradients.

```tsx
import { HtmlDivider } from "@comet/mail-react";

<MjmlRaw>
    <HtmlDivider />
    <HtmlDivider variant="thick" />
    <HtmlDivider height="2px" backgroundColor="#FF0000" />
    <HtmlDivider backgroundImage="linear-gradient(to right, red, blue)" />
</MjmlRaw>;
```

**Example theme**

```ts
import { createTheme } from "@comet/mail-react";

const theme = createTheme({
    divider: {
        defaultVariant: "thin",
        variants: {
            thin: { height: "1px", backgroundColor: "#999999" },
            thick: { height: { default: "12px", mobile: "8px" }, backgroundColor: "#222222" },
            gradient: {
                backgroundColor: "#5B4FC7",
                backgroundImage: "linear-gradient(to right, #5B4FC7, #FF6B6B, #FFD166)",
            },
        },
    },
});

declare module "@comet/mail-react" {
    interface DividerVariants {
        thin: true;
        thick: true;
        gradient: true;
    }
}
```
