---
title: Migration Guide
---

This chapter contains instructions for migrating from one COMET DXP version to another.

## @comet/upgrade

Codemods for automated updates, such as renames, are available at [@comet/upgrade](https://github.com/vivid-planet/comet-upgrade).

Example usage for upgrading from v4 to v5 (each major version should be upgraded separately):

```
npx @comet/upgrade v5
```

:::caution

Codemods are designed to ensure that upgrades are as smooth as possible, so their use is highly recommended.

:::
