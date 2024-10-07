---
title: Migrating from v7 to v8
sidebar_position: 1
---

# Migrating from v7 to v8

First, execute `npx @comet/upgrade@latest v8` in the root of your project.
It automatically installs the new versions of all `@comet` libraries, runs an ESLint autofix and handles some of the necessary renames.

<details>

<summary>Changes handled by @comet/upgrade</summary>

-   Upgrade MUI packages to v6
-   Run MUI codemods

</details>
