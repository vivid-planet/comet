---
"@comet/eslint-config": major
---

Enforce PascalCase for enums

Changing the casing of an existing enum can be problematic, e.g., if the enum values are persisted in the database. 
In such cases, the rule can be disabled like so

```diff
+ /* eslint-disable @typescript-eslint/naming-convention */
  export enum ExampleEnum {
      attr1 = "attr1",
  }
+ /* eslint-enable @typescript-eslint/naming-convention */
```
