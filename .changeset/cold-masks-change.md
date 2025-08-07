---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add configuration option `basePath` to the DAM settings in `comet-config.json`.

```diff
{
    "dam": {
        ...
+        "basePath": "foo"
    },
    ...
}
```
