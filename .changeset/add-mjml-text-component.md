---
"@comet/mail-react": minor
---

`MjmlText` now supports `variant` and `bottomSpacing` props, configured through `theme.text`

- `theme.text` defines static base styles, e.g., the global default font family
- `theme.text.variants` overrides the base styles, optionally, with responsive style objects where needed
- The `bottomSpacing` prop on `MjmlText` enables spacing below the text, as defined by the `theme.text.bottomSpacing` or `theme.text.variants.bottomSpacing` theme values
- `MjmlMailRoot` applies the `fontFamily` from `theme.text` as the mail-wide default

**Simple example theme**

```ts
import { createTheme } from "@comet/mail-react";

const theme = createTheme({
    text: {
        fontFamily: "Georgia, serif",
        fontSize: "16px",
        lineHeight: "24px",
        bottomSpacing: "12px",
    },
});
```

Usage:

```tsx
import { MjmlMailRoot, MjmlText } from "@comet/mail-react";

<MjmlMailRoot theme={theme}>
    <MjmlSection>
        <MjmlColumn>
            <MjmlText bottomSpacing>Hello</MjmlText>
            <MjmlText>This is a small paragraph.</MjmlText>
        </MjmlColumn>
    </MjmlSection>
</MjmlMailRoot>;
```

**Example theme with custom variants**

```ts
import { createTheme } from "@comet/mail-react";

const theme = createTheme({
    text: {
        fontFamily: "Georgia, serif",
        fontSize: "16px",
        lineHeight: "24px",
        defaultVariant: "body",
        variants: {
            heading: {
                fontSize: { default: "28px", mobile: "22px" },
                fontWeight: 700,
            },
            body: {
                fontSize: "16px",
            },
        },
    },
});

declare module "@comet/mail-react" {
    interface TextVariants {
        heading: true;
        body: true;
    }
}
```

Usage:

```tsx
import { MjmlMailRoot, MjmlText } from "@comet/mail-react";

<MjmlMailRoot theme={theme}>
    <MjmlSection>
        <MjmlColumn>
            <MjmlText variant="heading" bottomSpacing>
                Title
            </MjmlText>
            <MjmlText bottomSpacing>Body copy uses defaultVariant, which is "body" in this theme.</MjmlText>
            <MjmlText>This is another paragraph, using the "body" variant.</MjmlText>
        </MjmlColumn>
    </MjmlSection>
</MjmlMailRoot>;
```
