---
"@comet/mail-react": minor
---

Add theme background colors

Add a `colors` key to the theme with `background.body` and `background.content` defaults. `MjmlMailRoot` now applies `theme.colors.background.body` as the body background color, and `MjmlSection` applies `theme.colors.background.content` as the default section background when a theme is present. An explicit `backgroundColor` prop on `MjmlSection` always takes precedence.

**Example**

```tsx
const theme = createTheme({
    colors: {
        background: {
            body: "#EAEAEA",
            content: "#F8F8F8",
        },
    },
});

<MjmlMailRoot theme={theme}>
    <MjmlSection>
        {/* Section gets #F8F8F8 background from theme */}
    </MjmlSection>
    <MjmlSection backgroundColor="#FF0000">
        {/* Explicit prop overrides theme default */}
    </MjmlSection>
</MjmlMailRoot>
```
