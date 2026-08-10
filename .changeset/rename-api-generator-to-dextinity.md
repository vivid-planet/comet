---
"@dextinity/api-generator": major
---

Rename `@comet/api-generator` to `@dextinity/api-generator`

Update the dependency in `package.json` and all imports.

**Breaking changes**

- Rename the `comet-api-generator` binary to `dextinity-api-generator`:

    ```diff
    - "generate-crud": "comet-api-generator"
    + "generate-crud": "dextinity-api-generator"
    ```

- Change the header of generated files. Rerun the generator to update them
