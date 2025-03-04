# @comet/cli

## 7.15.0

## 7.14.0

## 7.13.0

## 7.12.0

### Minor Changes

-   753cd6f04: Add option for base64 encoding in `inject-site-configs` command

## 7.11.0

## 7.10.0

## 7.9.0

## 7.8.0

## 7.7.0

## 7.6.0

### Minor Changes

-   d353fc847: The `inject-site-configs` command locates the site-config-file argument relative to the current directory
-   9e2b0fac8: Add support for literal arrays to block meta

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

-   bc0570ff2: Fix setting prelogin domain for deployment with site-configs

## 7.4.2

## 7.4.1

## 7.4.0

### Patch Changes

-   a101ed6f5: inject-site-configs: Add sane defaults for preloginEnabled

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

-   360b8b137: Add `--input-file` and `--output-file` options to generate-block-types script for enhanced flexibility.

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
