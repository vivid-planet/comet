---
title: Content Generation
---

COMET DXP supports some features for generating content with third party tools (e.g., ChatGPT).

## DAM: Generating alt texts and titles for images

To enable this feature, perform the following steps:

### 1) API: Implement the `ContentGenerationServiceInterface`

```ts
@Injectable()
export class ContentGenerationService implements ContentGenerationServiceInterface {
    async generateAltText(fileId: string) {
        // ...
    }

    async generateImageTitle(fileId: string) {
        // ...
    }
}
```

#### Azure OpenAI

If you want to use Azure OpenAI for analyzing the images, you can use the `AzureOpenAiContentGenerationService` provided by the library:

```ts
@Injectable()
export class ContentGenerationService implements ContentGenerationServiceInterface {
    constructor(
        private readonly openAiContentGenerationService: AzureOpenAiContentGenerationService,
    ) {}

    async generateAltText(fileId: string) {
        return this.openAiContentGenerationService.generateAltText(fileId);
    }

    async generateImageTitle(fileId: string) {
        return this.openAiContentGenerationService.generateAltText(fileId);
    }
}
```

### 2) API: Add `ContentGenerationModule` to `AppModule`

Pass your implementation of `ContentGenerationService`:

```diff
// app.module.ts
export class AppModule {
   // ...
   imports: [
      // ...
+     ContentGenerationModule.register({
+        Service: ContentGenerationService,
+        config: { }
+     }),
   ],
   // ...
}

```

#### Azure OpenAI

For the `AzureOpenAiContentGenerationService` to work, you must pass a config to the `ContentGenerationModule`:

```diff
ContentGenerationModule.register({
   Service: ContentGenerationService,
   config: {
+       openAiContentGenerationService: {
+           apiKey: "example-key",
+           apiUrl: "example-url",
+           deploymentId: "example-deployment",
+       },
   },
});
```

### 3) Admin: Enable the features in your `DamConfigProvider`:

```diff
// App.tsx
 <DamConfigProvider
    value={{
        // ...
+       contentGeneration: {
+           generateAltText: true,
+           generateImageTitle: true,
+       },
    }}
 >
```