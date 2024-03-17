---
"@comet/admin-theme": minor
---

Add custom `Typography` variants for displaying inline lists

```
<Typography variant="list">
    <Typography variant="listItem">Lorem ipsum</Typography>
    <Typography variant="listItem">Lorem ipsum</Typography>
    <Typography variant="listItem">Lorem ipsum</Typography>
</Typography>
```

Hint: To use the custom variants without getting a type error, you must adjust the `tsconfig.json` in your project:

```diff
{
    // ...
    "compilerOptions": {
        // ...
+       "typeRoots": ["node_modules/@types", "node_modules/@comet/admin-theme"],
    },
    // ...
}
```