---
title: Content Translation
---

COMET DXP provides a content translation feature that allows editors to translate text fields, rich text content, documents, and entire page trees using a pluggable translation service.

## How it works

The translation system is built around the `ContentTranslationServiceProvider`, which supplies a translation function to the entire admin application. When enabled, translatable fields (text inputs, rich text editors) display a translate button, and documents/pages offer a "Translate" action in their toolbar menu.

Translation happens at three levels:

- **Fields**: Individual text inputs and rich text editors can be translated inline
- **Documents**: All translatable blocks within a document are translated at once
- **Page tree**: Multiple pages (including their names, slugs, and document content) are translated in batch

## Setup

### 1) API: Provide translation queries

The admin application needs GraphQL queries for translating text. You can either implement your own or use the built-in [Azure AI Translator](#azure-ai-translator) module.

:::info

The built-in Azure AI Translator queries require the `"translation"` permission. Make sure to assign this permission to users who should be able to translate content.

:::

### 2) Admin: Add the translation provider

Wrap your application with the `ContentTranslationServiceProvider` from `@comet/admin`:

```tsx title="App.tsx"
import { ContentTranslationServiceProvider } from "@comet/admin";

function App() {
    return (
        <ContentTranslationServiceProvider
            enabled={true}
            showApplyTranslationDialog
            translate={async (text) => {
                // Call your translation API
                return translatedText;
            }}
            batchTranslate={async (texts) => {
                // Optional: translate multiple texts at once for better performance
                return translatedTexts;
            }}
        >
            {children}
        </ContentTranslationServiceProvider>
    );
}
```

**Props:**

| Prop                         | Type                                         | Default | Description                                                         |
| ---------------------------- | -------------------------------------------- | ------- | ------------------------------------------------------------------- |
| `enabled`                    | `boolean`                                    |         | Enables the translation feature                                     |
| `translate`                  | `(text: string) => Promise<string>`          |         | Translates a single text                                            |
| `batchTranslate`             | `(texts: string[]) => Promise<string[]>`     |         | Translates multiple texts at once (falls back to sequential `translate` calls if not provided) |
| `showApplyTranslationDialog` | `boolean`                                    |         | Shows a confirmation dialog with the translation before applying it |

## Field-level translation

When the translation provider is enabled, text fields automatically show a translate button. Clicking it translates the field's current value.

### Text inputs

`FinalFormInput` fields of type `"text"` (the default) automatically support translation. A translate icon button appears in the input's end adornment.

If `showApplyTranslationDialog` is enabled on the provider, a dialog shows the original and translated text side by side, allowing the editor to review and edit the translation before applying it.

### Rich text editor

The rich text editor (`Rte` from `@comet/admin-rte`) also supports translation out of the box. A translate button appears in the toolbar. The editor translates the HTML content while preserving formatting and entities.

### Disabling translation for a field

Some fields should not be translated (e.g., URLs, identifiers, technical values). You can disable translation on a per-field basis:

**For text inputs**, use the `disableContentTranslation` prop:

```tsx
<Field
    name="youtubeIdentifier"
    component={FinalFormInput}
    disableContentTranslation
/>
```

**For the rich text editor**, pass `disableContentTranslation` in the options:

```tsx
<Rte value={value} onChange={onChange} options={{ disableContentTranslation: true }} />
```

## Document-level translation

To enable translation for a document, add translation methods to its definition using `createDocumentTranslationMethods`. This enables the "Translate" action in the document's toolbar menu, which translates all translatable blocks within the document at once.

### 1) Define root blocks and add translation methods

```tsx title="Page.tsx"
import {
    createDocumentRootBlocksMethods,
    createDocumentTranslationMethods,
    type DocumentInterface,
    type TranslatableInterface,
} from "@comet/cms-admin";

const rootBlocks = {
    content: PageContentBlock,
    seo: SeoBlock,
    stage: StageBlock,
};

export const Page: DocumentInterface & TranslatableInterface = {
    displayName: "Page",
    editComponent: EditPage,
    getQuery: gql`...`,
    updateMutation: gql`...`,
    ...createDocumentRootBlocksMethods(rootBlocks),
    ...createDocumentTranslationMethods(rootBlocks),
};
```

`createDocumentTranslationMethods` iterates over all root blocks and calls each block's `translateContent` method. Blocks that don't implement `translateContent` are skipped.

### 2) Add the translate menu item to the edit page

Use the `TranslateContentMenuItem` component in your edit page's toolbar:

```tsx title="EditPage.tsx"
import { CrudMoreActionsMenu } from "@comet/admin";
import { createUsePage, TranslateContentMenuItem } from "@comet/cms-admin";

const usePage = createUsePage({
    rootBlocks: { content: PageContentBlock, seo: SeoBlock, stage: StageBlock },
    pageType: "Page",
})({
    getQuery: gql`...`,
    updateMutation: gql`...`,
});

export const EditPage = ({ id }: Props) => {
    const { pageState, translateContent, pageSaveButton, /* ... */ } = usePage({ pageId: id });

    return (
        <CrudMoreActionsMenu
            overallActions={[
                <TranslateContentMenuItem
                    key="translate"
                    translateContent={translateContent}
                    disabled={!pageState?.document}
                />,
            ]}
        />
    );
};
```

The `translateContent` function returned by `usePage` handles the two-pass translation process:

1. **Collect**: Walks all blocks to gather translatable texts
2. **Batch translate**: Sends all texts to the translation service at once
3. **Apply**: Distributes translated texts back to the blocks and updates the page state

## Page tree translation

The page tree supports translating one or multiple pages at once, including their names, slugs, and document content. This is available through the `useTranslatePagesAction` hook.

When translating pages:

- Page names are translated and slugs are regenerated from the translated name
- The home page slug is preserved (not translated)
- Archived pages are skipped
- A progress dialog shows the current translation status
- If a translated slug already exists, a unique slug is generated automatically

The page tree translation is built in and works automatically when the translation provider is enabled and the document types implement the `TranslatableInterface`.

## Block-level translation

Built-in blocks like `RichTextBlock` and composite text fields (`createCompositeBlockTextField`) implement `translateContent` out of the box. Container blocks (`BlocksBlock`, `ColumnsBlock`, `ListBlock`, `OneOfBlock`, `OptionalBlock`) recursively translate their children.

### Custom blocks

To make a custom block translatable, implement the `translateContent` method:

```tsx
const MyBlock = createBlockSkeleton()({
    // ...
    translateContent: async (state, translate) => {
        const translatedTitle = state.title ? await translate(state.title) : state.title;
        return {
            ...state,
            title: translatedTitle,
            // Non-translatable fields are returned unchanged
        };
    },
});
```

The `translate` function passed to `translateContent` handles a single text string. For blocks used inside documents, this function is provided by the two-pass batch translation system, so individual `translate` calls are efficiently batched.

## Azure AI Translator

COMET provides a built-in integration with [Azure AI Translator](https://azure.microsoft.com/en-us/products/ai-services/ai-translator) as a ready-to-use translation service implementation.

### API setup

Register the `AzureAiTranslatorModule` in your `AppModule`:

```ts title="app.module.ts"
import { AzureAiTranslatorModule } from "@comet/cms-api";

@Module({
    imports: [
        // ...
        AzureAiTranslatorModule.register({
            endpoint: "https://api.cognitive.microsofttranslator.com",
            key: "your-api-key",
            region: "your-region",
        }),
    ],
})
export class AppModule {}
```

**Configuration:**

| Option     | Type     | Description                          |
| ---------- | -------- | ------------------------------------ |
| `endpoint` | `string` | Azure Translator service endpoint    |
| `key`      | `string` | API key for the translation service  |
| `region`   | `string` | Azure region                         |

:::tip

You can conditionally register the module based on whether the configuration is available:

```ts
...(config.azureAiTranslator
    ? [AzureAiTranslatorModule.register(config.azureAiTranslator)]
    : []),
```

:::

The module exposes two GraphQL queries:

- `azureAiTranslate(input: AzureAiTranslationInput!): String!` - Translates a single text
- `azureAiTranslateBatch(input: AzureAiTranslationBatchInput!): [String!]!` - Translates multiple texts (automatically chunked into batches of 25 to respect Azure API limits)

Both queries accept HTML content (`textType: "html"`) so formatting is preserved during translation.

### Admin setup

Use the `AzureAiTranslatorProvider` from `@comet/cms-admin` instead of configuring `ContentTranslationServiceProvider` manually. It handles the GraphQL queries and permission checks automatically:

```tsx title="App.tsx"
import { AzureAiTranslatorProvider } from "@comet/cms-admin";

function App() {
    return (
        <ContentScopeProvider>
            {({ match }) => (
                <AzureAiTranslatorProvider enabled showApplyTranslationDialog>
                    {/* Your app routes */}
                </AzureAiTranslatorProvider>
            )}
        </ContentScopeProvider>
    );
}
```

The provider:

- Checks the user's `"translation"` permission before enabling translation
- Uses the current content scope language as the target language
- Calls the `azureAiTranslate` and `azureAiTranslateBatch` GraphQL queries
- Supports both single and batch translation for optimal performance
