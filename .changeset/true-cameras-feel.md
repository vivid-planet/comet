---
"@comet/admin": minor
---

Add `description` and `customContent` props to `Tooltip`

`description` is intended to be used together with `title` to simplify creating detailed tooltips that match the Comet design:

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

`customContent` is an alternative to `title` and `description` for use-cases that require custom elements or styling:

```tsx
<Tooltip customContent={<SomethingCustom />}>
    <Info />
</Tooltip>
```
