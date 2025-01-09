---
"@comet/admin": minor
---

Add new `Button` component to use in favor of MUI's `Button` component

```diff
-import { Button } from "@mui/material";
+import { Button } from "@comet/admin";

const MyComponent = () => {
    return <Button onClick={() => console.log("Hello")}>Hello</Button>;
};
```
