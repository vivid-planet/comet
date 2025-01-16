---
"@comet/admin": minor
---

Add new `Button` with optional responsive behavior to use in favor of MUI's `Button`

When setting the `responsive` prop, the button will only show the icon on mobile and show the text content in a tooltip.

This works the same as MUI's `Button` component, with the exception of the `variant` and `color` props that are not supported in the same way.
This `Button` only supports values for `variant` that are defined by the Comet design guidelines, the `color` prop cannot be used.

```diff
-import { Button } from "@mui/material";
+import { Button } from "@comet/admin";

const MyComponent = () => {
    return <Button onClick={() => console.log("Hello")}>Hello</Button>;
};
```
