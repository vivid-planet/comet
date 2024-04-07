---
"@comet/admin-theme": minor
---

Add custom `Typography` variants for displaying inline lists

```tsx
<Typography variant="list">
    <Typography variant="listItem">Lorem ipsum</Typography>
    <Typography variant="listItem">Lorem ipsum</Typography>
    <Typography variant="listItem">Lorem ipsum</Typography>
</Typography>
```

Hint: To use the custom variants without getting a type error, you must adjust the `vendors.d.ts` in your project:

```diff
+ /// <reference types="@comet/admin-theme" />

// ...
```