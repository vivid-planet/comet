---
"@comet/admin": minor
---

Add new `Button` with optional responsive behavior to use in favor of MUI's `Button`

When setting the `responsive` prop, the button will only show the icon on mobile and show the text content in a tooltip.

```diff
-import { Button } from "@mui/material";
+import { Button } from "@comet/admin";

const MyComponent = () => {
    return <Button onClick={() => console.log("Hello")}>Hello</Button>;
};
```
