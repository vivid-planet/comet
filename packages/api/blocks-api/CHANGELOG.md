# @comet/blocks-api

## 6.9.0

### Minor Changes

-   8be9565d1: typesafeMigrationPipe: Add support for 20 migrations

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

-   be8664c75: Fix `RichTextBlock` draft content validation

    Extend validation to validate inline links in draft content.

## 6.7.0

## 6.6.2

## 6.6.1

## 6.6.0

### Minor Changes

-   e880929d8: Improve typing of `@RootBlockEntity()` decorator

    The target entity can now be passed as generic to have the correct type in `isVisible`:

    ```ts
    @RootBlockEntity<Product>({
        isVisible: (product) => product.visible,
    })
    export class Product extends BaseEntity<Product, "id"> {}
    ```

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

## 6.4.0

### Patch Changes

-   0efae68ff: Prevent XSS attacks in `@IsLinkTarget()` validator

## 6.3.0

## 6.2.1

## 6.2.0

### Minor Changes

-   75865caa: Deprecate `isHref` validator, `IsHref` decorator and `IsHrefConstraint` class.

    New versions `isLinkTarget`, `IsLinkTarget` and `IsLinkTargetConstraint` are added as replacement.

## 6.1.0

## 6.0.0

## 5.6.0

### Minor Changes

-   fd10b801: Add support for a custom block name and migrations to `createRichTextBlock`

## 5.5.0

## 5.4.0

## 5.3.0

### Minor Changes

-   920f2b85: Deprecate `nullable: true` for child blocks

    Nullable child blocks are not correctly supported in the Admin, for instance, in `createCompositeBlock`.
    Save a block's default values instead.

## 5.2.0

## 5.1.0

## 5.0.0

### Major Changes

-   c10a86c6: Change blocks-meta.json format: the key (type) for OneOfBlocks is now included

    Projects that still have a copy of `generate-block-types.ts` should switch to `@comet/cli`:

    -   Install `@comet/cli` as a dev dependency
    -   Replace the scripts in the package.json of your admin:

        ```json
            "generate-block-types": "comet generate-block-types --inputs",
            "generate-block-types:watch": "chokidar -s \"**/block-meta.json\" -c \"npm run generate-block-types\""
        ```

    -   Replace the scripts in the package.json of your site:

        ```json
            "generate-block-types": "comet generate-block-types",
            "generate-block-types:watch": "chokidar -s \"**/block-meta.json\" -c \"npm run generate-block-types\"",
        ```

-   c91906d2: Change the structure of `BlockIndexData` to make it generic

    Previously, `BlockIndexData` had one field: `damFileIds`. It could only represent dependencies to DAM files.

    Now, `BlockIndexData` has a generic `dependencies` field. It can represent dependencies to any entity.

    The `indexData()` method of a block must be refactored from

    ```ts
    indexData(): BlockIndexData {
        return {
            damFileIds: this.damFileId ? [this.damFileId] : [],
        };
    }
    ```

    to

    ```ts
    indexData(): BlockIndexData {
        if (this.damFileId === undefined) {
            return {};
        }

        return {
            dependencies: [
                {
                    targetEntityName: File.name,
                    id: this.damFileId,
                },
            ],
        };
    }
    ```

## 4.7.0

## 4.6.0

## 4.5.0

## 4.4.3

## 4.4.2

## 4.4.1

## 4.4.0

### Minor Changes

-   d4960b05: Add loop toggle to YouTubeVideo block

## 4.3.0

## 4.2.0

## 4.1.0
