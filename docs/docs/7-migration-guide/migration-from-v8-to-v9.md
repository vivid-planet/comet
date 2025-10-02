---
title: Migrating from v8 to v9
sidebar_position: -9
---

# Migrating from v8 to v9

## Admin

### Tooltip-related Changes

#### 🤖 Replace the `variant` prop with `color` in `Tooltip`

:::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v9/admin/after-install/tooltip-replace-variant-prop.ts
    ```

:::

<details>

The `variant` prop has been renamed to color and the options `neutral` and `primary` have been removed.
Change the usage of `variant` to `color` and remove or replace the values `neutral` and `primary`.

Example:

```diff
 <Tooltip
     title="Title"
-    variant="light"
+    color="light"
 >
     <Info />
 </Tooltip>
```

```diff
 <Tooltip
     title="Title"
-    variant="neutral"
 >
     <Info />
 </Tooltip>
```

</details>
