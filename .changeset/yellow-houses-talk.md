---
"@comet/admin-color-picker": major
"@comet/admin-react-select": major
"@comet/admin-date-time": major
"@comet/blocks-admin": major
"@comet/admin-theme": major
"@comet/admin-rte": major
"@comet/cms-admin": major
"@comet/admin": major
---

Change the method of overriding the styling of admin components

-   Remove dependency on the legacy `@mui/styles` package in favor of `@mui/material/styles`.
-   Add the ability to style components using [MUI's `sx` prop](https://mui.com/system/getting-started/the-sx-prop/).
-   Add the ability to style individual elements (slots) of a component using the `slotProps` and `sx` props.
-   The `$` syntax in the theme's `styleOverrides` is no longer supported, see: https://v5-0-6.mui.com/guides/migration-v4/#migrate-themes-styleoverrides-to-emotion

```diff
 const theme = createCometTheme({
     components: {
         CometAdminMyComponent: {
             styleOverrides: {
-                root: {
-                    "&$hasShadow": {
-                        boxShadow: "2px 2px 5px 0 rgba(0, 0, 0, 0.25)",
-                    },
-                    "& $header": {
-                        backgroundColor: "lime",
-                    },
-                },
+                hasShadow: {
+                    boxShadow: "2px 2px 5px 0 rgba(0, 0, 0, 0.25)",
+                },
+                header: {
+                    backgroundColor: "lime",
+                },
             },
         },
     },
 });
```

-   Overriding a component's styles with `withStyles` is no longer supported. Use the `sx` and `slotProps` props instead:

```diff
-import { withStyles } from "@mui/styles";
-
-const StyledMyComponent = withStyles({
-    root: {
-        backgroundColor: "lime",
-    },
-    header: {
-        backgroundColor: "fuchsia",
-    },
-})(MyComponent);
-
-// ...
-
-<StyledMyComponent title="Hello World" />;
+<MyComponent
+    title="Hello World"
+    sx={{
+        backgroundColor: "lime",
+    }}
+    slotProps={{
+        header: {
+            sx: {
+                backgroundColor: "fuchsia",
+            },
+        },
+    }}
+/>
```

-   The required changes we made to the theming method of admin components may cause missing or broken styles when using `styleOverrides` in `createCometTheme()`.
-   For more details, see MUI's migration guide: https://v5-0-6.mui.com/guides/migration-v4/#mui-styles
