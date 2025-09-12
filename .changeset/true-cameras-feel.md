---
"@comet/admin": minor
---

Add an optional `description` prop to `Tooltip` in addition to the existing `title` prop

This simplifies creating detailed tooltips that match the Comet design:

```diff
 <Tooltip
-    title={
-        <>
-            <Typography variant="subtitle2">Tooltip Title</Typography>
-            <Typography variant="body2">This is a detailed description of what's going on.</Typography>
-        </>
-    }
-    sx={{ width: 180 }}
+    title="Tooltip Title"
+    description="This is a detailed description of what's going on."
 >
     <Info />
 </Tooltip>
```
