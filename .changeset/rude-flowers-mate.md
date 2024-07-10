---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add an [Azure AI Translator](https://azure.microsoft.com/en-us/products/ai-services/ai-translator) implementation of the content translation feature

To use it, do the following:

**API:**

```diff
// app.module.ts
export class AppModule {
    static forRoot(config: Config): DynamicModule {
        return {
            imports: [
                // ...
+               AzureAiTranslatorModule.register({
+                   endpoint: envVars.AZURE_AI_TRANSLATOR_ENDPOINT,
+                   key: envVars.AZURE_AI_TRANSLATOR_KEY,
+                   region: envVars.AZURE_AI_TRANSLATOR_REGION,
+               }),
            ],
        };
    }
}
```

Users need the `translation` permission to use the translation feature.

**Admin:**

Wrap the section where you want to use the content translation with the `AzureAiTranslatorProvider` provider:

```tsx
<AzureAiTranslatorProvider enabled={true}>{/*  ...  */}</AzureAiTranslatorProvider>
```

Note: `AzureAiTranslatorProvider` automatically checks for the `translation` permission. The translation button is only shown for users with this permission.
