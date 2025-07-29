---
"@comet/admin": major
---

Adapt the styling of `Alert` to match the updated Comet design

Remove styling for the `text` variant of buttons used in `Alert`.
Use buttons with the `outlined` variant instead to adhere to the Comet design guidelines.

```diff
 <Alert
     // ...
     action={
-        <Button variant="text" startIcon={<ArrowRight />}>
+        <Button variant="outlined" startIcon={<ArrowRight />}>
             Action Text
         </Button>
     }
     // ...
 >
```
