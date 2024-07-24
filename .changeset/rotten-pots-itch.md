---
"@comet/admin": major
---

`FinalFormFileSelect` is now a simple final form wrapper around `FileSelect`

Props now mirror those of `FileSelect` and are passed through to the `FileSelect` component.
Setting `defaultProps` in the theme must now be done with `CometAdminFileSelect` instead of `CometAdminFinalFormFileSelect`.

Class keys have been removed. Apply custom styling to `CometAdminFileSelect` instead of `FinalFormFileSelect`.

The default value for `maxSize` has been removed.
You may want to set the previous default value of 50 MB explicitly.

```diff
 <Field
     name="files"
     label="Files"
     component={FinalFormFileSelect}
+    maxSize={50 * 1024 * 1024} // 50 MB
 />
```

The `disableDropzone` prop has been removed.
Use `slotProps.dropzone.hideDroppableArea` instead.

```diff
 <Field
     name="files"
     label="Files"
     component={FinalFormFileSelect}
-    disableDropzone
+    slotProps={{
+        dropzone: {
+            hideDroppableArea: true,
+        },
+    }}
 />
```

The `disableSelectFileButton` prop has been removed.
Use `slotProps.dropzone.hideButton` instead.

```diff
 <Field
     name="files"
     label="Files"
     component={FinalFormFileSelect}
-    disableSelectFileButton
+    slotProps={{
+        dropzone: {
+            hideButton: true,
+        },
+    }}
 />
```
