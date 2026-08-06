---
"@dextinity/admin-generator": major
---

Rename `@comet/admin-generator` to `@dextinity/admin-generator`

Update the dependency in `package.json` and all imports.

**Breaking changes**

- Rename the `comet-admin-generator` binary to `dextinity-admin-generator`:

    ```diff
    - "generate-admin": "comet-admin-generator generate"
    + "generate-admin": "dextinity-admin-generator generate"
    ```

- Rename the config file suffix from `.cometGen.tsx` to `.dextinityGen.tsx`. The default file pattern is now `src/**/*.dextinityGen.{ts,tsx}`
- Change the header of generated files. Rerun the generator to update them
