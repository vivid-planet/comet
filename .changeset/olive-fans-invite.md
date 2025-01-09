---
"@comet/admin": minor
---

Add new `Button` component to use in favor of MUI's `Button` component

This works the same as MUI's `Button` component, with the exception of the `variant` and `color` props that are not supported in the same way.
This `Button` only supports values for `variant` that are defined by the Comet design guidelines, the `color` prop cannot be used.

```diff
-import { Button } from "@mui/material";
+import { Button } from "@comet/admin";

const MyComponent = () => {
    return <Button onClick={() => console.log("Hello")}>Hello</Button>;
};
```
