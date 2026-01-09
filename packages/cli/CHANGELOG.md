# @comet/cli

## 8.10.0

## 8.9.0

## 8.8.0

## 8.7.1

## 8.7.0

## 8.6.0

### Minor Changes

- 4c452a1: Add download-mitmproxy command

## 8.5.2

## 8.5.1

## 8.5.0

## 8.4.2

## 8.4.1

## 8.4.0

### Minor Changes

- c8f5d89: Add support for literal arrays to block meta

## 8.3.0

## 8.2.0

## 8.1.1

## 8.1.0

## 8.0.0

### Major Changes

- f904b71: Require Node v22

    The minimum required Node version is now v22.0.0.
    See the migration guide for instructions on how to upgrade your project.

- 23335c6: Remove workarounds in `inject-site-configs` command.

    Please use the command like the current implementation in the starter.

### Minor Changes

- 5164ad3: comet generate-block-types generates now `AllBlockNames` type, which contains a string union for all blocks

## 8.0.0-beta.6

### Minor Changes

- 5164ad3: comet generate-block-types generates now `AllBlockNames` type, which contains a string union for all blocks

## 8.0.0-beta.5

### Major Changes

- 23335c6: Remove workarounds in `inject-site-configs` command.

    Please use the command like the current implementation in the starter.

## 8.0.0-beta.4

## 8.0.0-beta.3

## 8.0.0-beta.2

### Major Changes

- f904b71: Require Node v22

    The minimum required Node version is now v22.0.0.
    See the migration guide for instructions on how to upgrade your project.

## 8.0.0-beta.1

## 8.0.0-beta.0

## 7.25.3

## 7.25.2

## 7.25.1

## 7.25.0

## 7.24.0

## 7.23.0

## 7.22.0

## 7.21.1

## 7.21.0

## 7.20.0

## 7.19.0

## 7.18.0

## 7.17.0

## 7.16.0

## 7.15.0

## 7.14.0

## 7.13.0

## 7.12.0

### Minor Changes

- 753cd6f04: Add option for base64 encoding in `inject-site-configs` command

## 7.11.0

## 7.10.0

## 7.9.0

## 7.8.0

## 7.7.0

## 7.6.0

### Minor Changes

- d353fc847: The `inject-site-configs` command locates the site-config-file argument relative to the current directory
- 9e2b0fac8: Add support for literal arrays to block meta

    String, number, boolean, and JSON arrays can be defined by setting `array: true`.

    **Example**

    ```ts
    class NewsListBlockData {
        @BlockField({ type: "string", array: true })
        newsIds: string[];
    }
    ```

## 7.5.0

### Patch Changes

- bc0570ff2: Fix setting prelogin domain for deployment with site-configs

## 7.4.2

## 7.4.1

## 7.4.0

### Patch Changes

- a101ed6f5: inject-site-configs: Add sane defaults for preloginEnabled

    When `preloginEnabled` is `undefined` or `null` set it to `true`
    on environments != `prod` or `local`.

## 7.3.2

## 7.3.1

## 7.3.0

## 7.2.1

## 7.2.0

## 7.1.0

## 7.0.0

## 7.0.0-beta.6

## 7.0.0-beta.5

## 7.0.0-beta.4

## 7.0.0-beta.3

## 7.0.0-beta.2

## 7.0.0-beta.1

## 7.0.0-beta.0

## 6.17.1

## 6.17.0

## 6.16.0

## 6.15.1

## 6.15.0

## 6.14.1

## 6.14.0

## 6.13.0

## 6.12.0

## 6.11.0

## 6.10.0

## 6.9.0

## 6.8.0

### Minor Changes

- 360b8b137: Add `--input-file` and `--output-file` options to generate-block-types script for enhanced flexibility.

## 6.7.0

## 6.6.2

## 6.6.1

## 6.6.0

## 6.5.0

## 6.4.0

## 6.3.0

## 6.2.1

## 6.2.0

## 6.1.0

## 6.0.0

## 5.6.0

## 5.5.0

## 5.4.0

## 5.3.0

## 5.2.0

## 5.1.0

## 5.0.0

## 4.7.0

## 4.6.0

## 4.5.0

## 4.4.3

## 4.4.2

## 4.4.1

## 4.4.0

## 4.3.0

## 4.2.0

## 4.1.0
