---
"@comet/eslint-config": major
---

Enforce casing in enums (PascalCase for enum names and camelCase for enum members)

Changing the casing of an existing enum can be problematic, e.g., if the enum values are persisted in the database.
In such cases, the rule can be disabled like so

```diff
+ /* eslint-disable @typescript-eslint/naming-convention */
  export enum ExampleEnum {
      Attr1 = "Attr1",
  }
+ /* eslint-enable @typescript-eslint/naming-convention */
```

For existing projects, you can also "disable" the rule in your whole project by overriding it and allowing all casings:

```json
// .eslintrc.json
"overrides": [
    {
        "files": ["*.ts", "*.tsx"],
        "rules": {
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    "selector": "enum",
                    "format": null
                },
                {
                    "selector": "enumMember",
                    "format": null
                }
            ]
        }
    }
]
```
