# @comet/eslint-plugin

## 6.18.0

## 6.17.17

## 6.17.16

## 6.17.15

## 6.17.14

## 6.17.13

## 6.17.12

## 6.17.11

## 6.17.10

## 6.17.9

## 6.17.8

## 6.17.7

## 6.17.6

## 6.17.5

## 6.17.4

## 6.17.3

## 6.17.2

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
