---
"@comet/admin": major
---

Rename `variant` prop of `Tooltip` to `color` and remove the `neutral` and `primary` options

```diff
 <Tooltip
     title="Title"
-    variant="light"
+    color="light"
 >
     <Info />
 </Tooltip>
```

```diff
 <Tooltip
     title="Title"
-    variant="neutral"
 >
     <Info />
 </Tooltip>
```
