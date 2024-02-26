# @comet/blocks-admin

## 6.2.0

### Patch Changes

-   @comet/admin@6.2.0
-   @comet/admin-icons@6.2.0

## 6.1.0

### Patch Changes

-   Updated dependencies [dcfa03ca]
-   Updated dependencies [08e0da09]
-   Updated dependencies [b35bb8d1]
-   Updated dependencies [8eb13750]
-   Updated dependencies [a4fac913]
    -   @comet/admin@6.1.0
    -   @comet/admin-icons@6.1.0

## 6.0.0

### Patch Changes

-   Updated dependencies [921f6378]
-   Updated dependencies [76e50aa8]
-   Updated dependencies [298b63b7]
-   Updated dependencies [a525766c]
-   Updated dependencies [0d768540]
-   Updated dependencies [62779124]
    -   @comet/admin@6.0.0
    -   @comet/admin-icons@6.0.0

## 5.6.0

### Patch Changes

-   76f85abe: Fix linking from block preview to block admin for non-trivial composite/list block combinations
    -   @comet/admin@5.6.0
    -   @comet/admin-icons@5.6.0

## 5.5.0

### Patch Changes

-   @comet/admin@5.5.0
-   @comet/admin-icons@5.5.0

## 5.4.0

### Patch Changes

-   Updated dependencies [ba800163]
-   Updated dependencies [60a18392]
    -   @comet/admin@5.4.0
    -   @comet/admin-icons@5.4.0

## 5.3.0

### Minor Changes

-   a2273887: Add support for custom block categories

    Allows specifying custom block categories in application code.

    **Example:**

    In `src/common/blocks/customBlockCategories.tsx`:

    ```tsx
    import { BlockCategory, CustomBlockCategory } from "@comet/blocks-admin";
    import React from "react";
    import { FormattedMessage } from "react-intl";

    const productsBlockCategory: CustomBlockCategory = {
        id: "Products",
        label: <FormattedMessage id="blocks.category.products" defaultMessage="Products" />,
        // Specify where category will be shown in drawer
        insertBefore: BlockCategory.Teaser,
    };

    export { productsBlockCategory };
    ```

    In `src/documents/pages/blocks/MyBlock.tsx`:

    ```tsx
    import { productsBlockCategory } from "@src/common/blocks/customBlockCategories";

    const MyBlock: BlockInterface = {
        category: productsBlockCategory,
        ...
    };
    ```

### Patch Changes

-   Updated dependencies [0ff9b9ba]
-   Updated dependencies [0ff9b9ba]
-   Updated dependencies [a677a162]
-   Updated dependencies [60cc1b2a]
-   Updated dependencies [5435b278]
    -   @comet/admin-icons@5.3.0
    -   @comet/admin@5.3.0

## 5.2.0

### Minor Changes

-   824ea66a: Improve layout selection UX in `createColumnsBlock`

    Hide select when there's only one layout for a specific number of columns

### Patch Changes

-   3702bb23: Infer additional item fields in `BlocksBlock` and `ListBlock`

    Additional fields in the `item` prop of `AdditionalItemContextMenuItems` and `AdditionalItemContent` will be typed correctly if the `additionalItemFields` option is strongly typed.

-   Updated dependencies [25daac07]
-   Updated dependencies [0bed4e7c]
-   Updated dependencies [9fc7d474]
    -   @comet/admin@5.2.0
    -   @comet/admin-icons@5.2.0

## 5.1.0

### Patch Changes

-   Updated dependencies [21c30931]
-   Updated dependencies [93b3d971]
-   Updated dependencies [e33cd652]
    -   @comet/admin@5.1.0
    -   @comet/admin-icons@5.1.0

## 5.0.0

### Major Changes

-   9875e7d4: Support automatically importing DAM files into another scope when copying documents from one scope to another

    The copy process was reworked:

    -   The `DocumentInterface` now requires a `dependencies()` and a `replaceDependenciesInOutput()` method
    -   The `BlockInterface` now has an optional `dependencies()` and a required `replaceDependenciesInOutput()` method
    -   `rewriteInternalLinks()` was removed from `@comet/cms-admin`. Its functionality is replaced by `replaceDependenciesInOutput()`.

    `dependencies()` returns information about dependencies of a document or block (e.g. a used `DamFile` or linked `PageTreeNode`). `replaceDependenciesInOutput()` replaces the IDs of all dependencies of a document or block with new IDs (necessary for copying documents or blocks to another scope).

    You can use the new `createDocumentRootBlocksMethods()` to generate the methods for documents (see section @comet/cms-admin).

-   4fe08312: Remove `BlockPreview` component, use higher level `BlockPreviewContent` instead

    **Before:**

    ```tsx
    const state = linkBlock.input2State(params.value);

    return <BlockPreview title={linkBlock.dynamicDisplayName?.(state) ?? linkBlock.displayName} content={linkBlock.previewContent(state)} />;
    ```

    **After:**

    ```tsx
    return <BlockPreviewContent block={linkBlock} input={params.value} />;
    ```

### Minor Changes

-   a7116784: Allow composite blocks with multiple sub blocks that have their own subroutes (e.g. a list)

### Patch Changes

-   Updated dependencies [0453c36a]
-   Updated dependencies [692c8555]
-   Updated dependencies [2559ff74]
-   Updated dependencies [fe5e0735]
-   Updated dependencies [ed692f50]
-   Updated dependencies [987f08b3]
-   Updated dependencies [d0773a1a]
-   Updated dependencies [5f0f8e6e]
-   Updated dependencies [7c6eb68e]
-   Updated dependencies [d4bcab04]
-   Updated dependencies [0f2794e7]
-   Updated dependencies [80b007ae]
-   Updated dependencies [a7116784]
-   Updated dependencies [e57c6c66]
    -   @comet/admin@5.0.0
    -   @comet/admin-icons@5.0.0

## 4.7.0

### Patch Changes

-   f48a768c: Fix padding behavior of `YoutubeVideoBlock` and `DamVideoBlock` when used inside `AdminComponentPaper`
-   Updated dependencies [dbdc0f55]
-   Updated dependencies [eac9990b]
-   Updated dependencies [fe310df8]
-   Updated dependencies [fde8e42b]
    -   @comet/admin-icons@4.7.0
    -   @comet/admin@4.7.0

## 4.6.0

### Patch Changes

-   031d86eb: Fix drag and drop reordering in collection blocks
-   Updated dependencies [c3b7f992]
-   Updated dependencies [c3b7f992]
    -   @comet/admin-icons@4.6.0
    -   @comet/admin@4.6.0

## 4.5.0

### Patch Changes

-   Updated dependencies [46cf5a8b]
-   Updated dependencies [8a2c3302]
-   Updated dependencies [6d4ca5bf]
-   Updated dependencies [07d921d2]
    -   @comet/admin@4.5.0
    -   @comet/admin-icons@4.5.0

## 4.4.3

### Patch Changes

-   @comet/admin@4.4.3
-   @comet/admin-icons@4.4.3

## 4.4.2

### Patch Changes

-   @comet/admin@4.4.2
-   @comet/admin-icons@4.4.2

## 4.4.1

### Patch Changes

-   Updated dependencies [662abcc9]
    -   @comet/admin@4.4.1
    -   @comet/admin-icons@4.4.1

## 4.4.0

### Minor Changes

-   d4960b05: Add loop toggle to YouTubeVideo block

### Patch Changes

-   Updated dependencies [e824ffa6]
-   Updated dependencies [3e15b819]
-   Updated dependencies [a77da844]
    -   @comet/admin@4.4.0
    -   @comet/admin-icons@4.4.0

## 4.3.0

### Patch Changes

-   @comet/admin@4.3.0
-   @comet/admin-icons@4.3.0

## 4.2.0

### Patch Changes

-   b4d564b6: Add spacing by default between the tabs and the tab content when using `AdminTabs` or `BlockPreviewWithTabs`. This may add unwanted additional spacing in cases where the spacing was added manually.
-   0f4ed6c1: Prevent unintentional movement of sticky header when scrolling in Tabs.
-   Updated dependencies [67e54a82]
-   Updated dependencies [3567533e]
-   Updated dependencies [7b614c13]
-   Updated dependencies [aaf1586c]
-   Updated dependencies [d25a7cbb]
    -   @comet/admin@4.2.0
    -   @comet/admin-icons@4.2.0

## 4.1.0

### Patch Changes

-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [c5f2f918]
    -   @comet/admin@4.1.0
    -   @comet/admin-icons@4.1.0
