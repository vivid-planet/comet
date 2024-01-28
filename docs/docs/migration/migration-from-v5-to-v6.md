---
title: Migrating from v4 to v5
sidebar_position: 1
---

# Migrating from v5 to v6

## API


## Admin


## Site


## ESLint

### @comet/no-other-module-relative-import

The `@comet/no-other-module-relative-import` rule is now enabled by default. It enforces absolute imports when importing from other modules.

**This rule is auto-fixable.** All warnings can be fixed by executing `npm run lint:eslint -- --fix` in `/api`, `/admin` and `/site`.

**Example:**

`import { AThingInModuleA } from "../moduleA/AThingInModuleA"`

is changed to 

`import { AThingInModuleA } from "@src/moduleA/AThingInModuleA"`

