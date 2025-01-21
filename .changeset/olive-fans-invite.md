---
"@comet/admin": minor
---

Add a new `Button` component to replace `ToolbarActionButton` and MUI's `Button`

Compared to MUI's `Button` component, the `color` prop has been removed, and the `variant` prop now defines those variants, defined by the Comet design guidelines, `primary` is the default variant.

```diff
-import { Button } from "@mui/material";
+import { Button } from "@comet/admin";

 export const AllButtonVariants = () => (
     <>
-        <Button variant="contained" color="primary">Primary</Button>
+        <Button>Primary</Button>
-        <Button variant="contained" color="secondary">Secondary</Button>
+        <Button variant="secondary">Secondary</Button>
-        <Button variant="outlined">Outlined</Button>
+        <Button variant="outlined">Outlined</Button>
-        <Button variant="outlined" color="error">Destructive</Button>
+        <Button variant="destructive">Destructive</Button>
-        <Button variant="contained" color="success">Success</Button>
+        <Button variant="success">Success</Button>
-        <Button variant="text" sx={{ color: "white" }}>Text Light</Button>
+        <Button variant="textLight">Text Light</Button>
-        <Button variant="text" sx={{ color: "black" }}>Text Dark</Button>
+        <Button variant="textDark">Text Dark</Button>
     </>
 );
```

**Responsive behavior**

`ToolbarActionButton` is now deprecated.
Previously, `ToolbarActionButton` would hide its text content on mobile and add it with a tooltip instead.
This behavior can now be achieved by setting the `responsive` prop on the `Button` component.

```diff
-import { ToolbarActionButton } from "@comet/admin/lib/common/toolbar/actions/ToolbarActionButton";
+import { Button } from "@comet/admin";
 import { Favorite } from "@comet/admin-icons";

 const Example = () => {
-    return <ToolbarActionButton startIcon={<Favorite />}>Hello</ToolbarActionButton>;
+    return <Button responsive startIcon={<Favorite />}>Hello</Button>;
 };
```
