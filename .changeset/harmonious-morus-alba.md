---
"@comet/admin": minor
"@comet/admin-rte": minor
---

Add a dialog option to the translation feature

If enabled a dialog will open when pressing the translation button showing the original text and an editable translation

Control if the dialog should be shown for the current scope via the `showApplyTranslationDialog` prop

```diff
<ContentTranslationServiceProvider
    enabled={true}
+   showApplyTranslationDialog={true}
    translate={...}
>
```
