---
"@comet/mail-react": major
---

`MjmlDivider` now supports `variant`, `height`, `backgroundColor`, and `backgroundImage` props, configured through `theme.divider`

- `theme.divider` defines the default `height` and `backgroundColor`
- `theme.divider.variants` overrides those values for named variants, optionally with per-breakpoint responsive values
- `theme.divider.backgroundImage` (typically a gradient) overlays the bar while `backgroundColor` stays as the solid fallback for clients that don't render gradients
- Per-instance `height`, `backgroundColor`, and `backgroundImage` props override the resolved theme/variant values

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

Usage:

```tsx
import { MjmlDivider, MjmlMailRoot } from "@comet/mail-react";

<MjmlMailRoot theme={theme}>
    <MjmlSection>
        <MjmlColumn>
            <MjmlDivider />
            <MjmlDivider variant="thick" />
            <MjmlDivider variant="gradient" />
            <MjmlDivider height="2px" backgroundColor="#FF0000" />
        </MjmlColumn>
    </MjmlSection>
</MjmlMailRoot>;
```

**Breaking changes**

- The `MjmlDivider` prop surface no longer accepts `borderWidth`, `borderColor`, `borderStyle`, `padding` and its variants, `width`, `containerBackgroundColor`, `align`, or `cssClass`. Migrate `borderWidth` to `height` and `borderColor` to `backgroundColor`, either per-call or on `theme.divider`.
- `MjmlDivider` no longer applies any default padding around the divider. Add spacing through the surrounding section or column (for example with `MjmlSpacer`).
- `<MjmlAttributes><MjmlDivider … /></MjmlAttributes>` no longer sets defaults for `MjmlDivider`. Configure defaults through `theme.divider` instead.
