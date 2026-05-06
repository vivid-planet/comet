---
"@comet/admin": minor
"@comet/admin-rte": minor
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add support for translating page and document content

Content translation can now be applied to entire documents at once, in addition to the existing field-level translation.

**Setup**

Wrap the application with `AzureAiTranslatorProvider` (supports `batchTranslate` automatically):

```tsx
<AzureAiTranslatorProvider enabled showApplyTranslationDialog>
    {children}
</AzureAiTranslatorProvider>
```

**Making a document type translatable**

Add `createDocumentTranslationMethods` and the `TranslatableInterface` type to the document definition:

```tsx
import { createDocumentTranslationMethods, type TranslatableInterface } from "@comet/cms-admin";

const rootBlocks = {
    content: PageContentBlock,
    seo: SeoBlock,
};

export const Page: DocumentInterface & TranslatableInterface & DependencyInterface = {
    // ...existing config
    ...createDocumentRootBlocksMethods(rootBlocks),
    ...createDocumentTranslationMethods(rootBlocks),
};
```

**Adding translate action to the edit page**

`createUsePage` now returns a `translateContent` function. Use it with `TranslateContentMenuItem` inside a `CrudMoreActionsMenu`:

```tsx
const { translateContent /* ...other fields */ } = usePage({ pageId: id });

<CrudMoreActionsMenu overallActions={[<TranslateContentMenuItem translateContent={translateContent} />]} />;
```

**Page tree integration**

The page tree context menu and bulk action toolbar automatically show a "Translate" action for pages. This translates the page name, slug, and document content.
