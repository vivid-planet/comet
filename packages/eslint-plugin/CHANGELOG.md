# @comet/eslint-plugin

## 7.25.8

## 7.25.7

## 7.25.6

## 7.25.5

## 7.25.4

## 7.25.3

## 7.25.2

## 7.25.1

### Patch Changes

-   85e80218f: Support dot separated imports in no-private-sibling-import rule

    This allows, for example, importing from MyBlock.loader.gql.ts in MyBlock.loader.ts

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

## 7.11.0

## 7.10.0

## 7.9.0

## 7.8.0

## 7.7.0

## 7.6.0

## 7.5.0

## 7.4.2

## 7.4.1

## 7.4.0

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

### Minor Changes

-   ec0582e6: Add new ESLint rule to enforce absolute imports when importing from other modules

    For instance, an import `import { AThingInModuleA } from "../moduleA/AThingInModuleA"` in module `B` needs to be imported as `import { AThingInModuleA } from "@src/moduleA/AThingInModuleA"`.
    The default source root `"./src"` and alias `"@src"` can be changed via the rule's `sourceRoot` and `sourceRootAlias` options.
    This rule will be enforced by `@comet/eslint-config` in the next major release.

## 5.0.0
