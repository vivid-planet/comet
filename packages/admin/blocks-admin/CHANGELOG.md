# @comet/blocks-admin

## 6.14.1

### Patch Changes

-   @comet/admin@6.14.1
-   @comet/admin-icons@6.14.1

## 6.14.0

### Patch Changes

-   Updated dependencies [2fc764e29]
-   Updated dependencies [efccc42a3]
-   Updated dependencies [012a768ee]
    -   @comet/admin@6.14.0
    -   @comet/admin-icons@6.14.0

## 6.13.0

### Patch Changes

-   Updated dependencies [5e25348bb]
-   Updated dependencies [796e83206]
    -   @comet/admin@6.13.0
    -   @comet/admin-icons@6.13.0

## 6.12.0

### Patch Changes

-   Updated dependencies [16ffa7be9]
    -   @comet/admin@6.12.0
    -   @comet/admin-icons@6.12.0

## 6.11.0

### Patch Changes

-   Updated dependencies [8e3dec523]
    -   @comet/admin@6.11.0
    -   @comet/admin-icons@6.11.0

## 6.10.0

### Patch Changes

-   Updated dependencies [a8a098a24]
-   Updated dependencies [d4a269e1e]
-   Updated dependencies [52130afba]
-   Updated dependencies [e938254bf]
    -   @comet/admin@6.10.0
    -   @comet/admin-icons@6.10.0

## 6.9.0

### Minor Changes

-   e85837a17: Loosen peer dependency on `react-intl` to allow using v6

### Patch Changes

-   Updated dependencies [9ff9d66c6]
-   Updated dependencies [e85837a17]
    -   @comet/admin@6.9.0
    -   @comet/admin-icons@6.9.0

## 6.8.0

### Minor Changes

-   90c6f192e: Deprecate `SpaceBlock`

    It will be replaced by the `createSpaceBlock` factory since it had no real use case.

-   90c6f192e: Add `createSpaceBlock` factory

    Allows selecting a spacing value out of a list of provided options.

    **Example**

    API

    ```tsx
    enum Spacing {
        d150 = "d150",
        d200 = "d200",
    }

    export const SpaceBlock = createSpaceBlock({ spacing: Spacing }, "DemoSpace");
    ```

    Admin

    ```tsx
    const options = [
        { value: "d150", label: "Dynamic 150" },
        { value: "d200", label: "Dynamic 200" },
    ];

    export const SpaceBlock = createSpaceBlock<string>({ defaultValue: options[0].value, options });
    ```

### Patch Changes

-   @comet/admin@6.8.0
-   @comet/admin-icons@6.8.0

## 6.7.0

### Patch Changes

-   @comet/admin@6.7.0
-   @comet/admin-icons@6.7.0

## 6.6.2

### Patch Changes

-   @comet/admin@6.6.2
-   @comet/admin-icons@6.6.2

## 6.6.1

### Patch Changes

-   @comet/admin@6.6.1
-   @comet/admin-icons@6.6.1

## 6.6.0

### Minor Changes

-   a65679ba3: Add `minVisibleBlocks` option to `createListBlock` factory

    This enables the possibility to enforce a minimum amount of blocks added to a list block. List blocks with less than the required amount of visible entries can't be saved.

    **Example usage:**

    ```diff
    export const SomeListBlock = createListBlock({
        // ...
    +   minVisibleBlocks: 2,
    });
    ```

### Patch Changes

-   Updated dependencies [95b97d768]
-   Updated dependencies [6b04ac9a4]
    -   @comet/admin@6.6.0
    -   @comet/admin-icons@6.6.0

## 6.5.0

### Minor Changes

-   2f64daa9b: Add `title` field to link block

    Perform the following steps to use it in an application:

    1. API: Use the new `createLinkBlock` factory to create the LinkBlock:

        ```ts
        import { createLinkBlock } from "@comet/cms-api";

        // ...

        const LinkBlock = createLinkBlock({
            supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, news: NewsLinkBlock },
        });
        ```

    2. Site: Pass the `title` prop to LinkBlock's child blocks:

    ```diff
    const supportedBlocks: SupportedBlocks = {
    -   internal: ({ children, ...props }) => <InternalLinkBlock data={props}>{children}</InternalLinkBlock>,
    +   internal: ({ children, title, ...props }) => <InternalLinkBlock data={props} title={title}>{children}</InternalLinkBlock>,
        // ...
    };
    ```

### Patch Changes

-   Updated dependencies [6cb2f9046]
    -   @comet/admin@6.5.0
    -   @comet/admin-icons@6.5.0

## 6.4.0

### Minor Changes

-   30d9e0dee: Add `createCompositeBlockSelectField` helper function

    To simplify the creation of a select field blocks by hiding the verbose definition of `Form`, `Field` and items.

-   322da3831: Add `resolveDependencyPath()` to `BlockMethods` interface

    Blocks must now offer a `resolveDependencyPath()` method that returns a URL path based on the block's `state` and `jsonPath`.
    It can be used to build the URL to a block's edit view.

    For most cases, the default implementation of this method should be sufficient, so you don't have to implement it yourself.
    You must only override it manually if your block's admin component contains special routing logic (e.g. `RouterTabs`).

-   887365c76: Add `createCompositeBlockTextField` helper function

    To simplify the creation of a text block field by hiding the verbose definition of `Form` and `Field`.

### Patch Changes

-   811903e60: Disable the content translation feature for input fields where it doesn't make sense
-   Updated dependencies [8ce21f34b]
-   Updated dependencies [811903e60]
    -   @comet/admin@6.4.0
    -   @comet/admin-icons@6.4.0

## 6.3.0

### Patch Changes

-   @comet/admin@6.3.0
-   @comet/admin-icons@6.3.0

## 6.2.1

### Patch Changes

-   @comet/admin@6.2.1
-   @comet/admin-icons@6.2.1

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
