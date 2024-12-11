---
"@comet/admin": major
---

Fix styling of `Alert` according to Comet DXP design

Remove styling for `text` variant of Buttons used in `Alert`.
Use `variant="outlined"` instead.

```diff
        <Alert
    // ...
    action={
-       <Button variant="text" startIcon={<ArrowRight />}>
-           Action Text
-       </Button>
+       <Button variant="outlined" startIcon={<ArrowRight />}>
+           Action Text
+       </Button>
    }
    // ...
>
```
