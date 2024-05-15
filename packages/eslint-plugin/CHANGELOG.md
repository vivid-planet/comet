# @comet/eslint-plugin

## 5.8.3

## 5.8.2

## 5.8.1

## 5.8.0

## 5.7.2

## 5.7.1

## 5.7.0

## 5.6.6

## 5.6.5

## 5.6.4

## 5.6.3

## 5.6.2

## 5.6.1

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
