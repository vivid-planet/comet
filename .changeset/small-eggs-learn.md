---
"@comet/cms-api": major
---

API Generator: Replace graphql-type-json with graphql-scalars for JSON columns

**Upgrading**

1. Install graphql-scalars: `npm install graphql-scalars`
2. Uninstall graphql-type-json: `npm install graphql-type-json`
3. Update imports:

    ```diff
    - import { GraphQLJSONObject } from "graphql-type-json";
    + import { GraphQLJSONObject } from "graphql-scalars";
    ```
