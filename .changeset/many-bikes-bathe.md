---
"@comet/admin-generator": major
---

Convert to ESM

To upgrade, make the following changes to your `tsconfig.json`:

```diff
{
    "compilerOptions": {
-       "module": "ESNext",
-       "moduleResolution": "Node",
+       "module": "preserve",
+       "moduleResolution": "bundler"
    }
}
```
