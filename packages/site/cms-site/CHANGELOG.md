# @comet/cms-site

## 6.11.0

## 6.10.0

### Minor Changes

-   5c1ab80d6: SeoBlock: Change Open Graph image to recommended size and aspect ratio (`1200x630`)

## 6.9.0

## 6.8.0

## 6.7.0

## 6.6.2

## 6.6.1

## 6.6.0

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

## 6.3.0

## 6.2.1

## 6.2.0

### Minor Changes

-   34bb33fe: Add `SeoBlock`

    Can be used as a drop-in replacement for `SeoBlock` defined in application code. Add a `resolveOpenGraphImageUrlTemplate` to resolve the correct image URL template when using a custom Open Graph image block.

    **Example Default Use Case:**

    ```tsx
    <SeoBlock data={exampleData} title={"Some Example Title"} />
    ```

    **Example Custom Use Case:**

    ```tsx
    <SeoBlock<SomeCustomImageBlockType>
        data={exampleData}
        title={"Some Example Title"}
        resolveOpenGraphImageUrlTemplate={(block) => block.some.path.to.urlTemplate}
    />
    ```

## 6.1.0

## 6.0.0

## 5.6.0

## 5.5.0

## 5.4.0

### Minor Changes

-   f9063860: Add `hasRichTextBlockContent` helper

    The helper can be used to conditionally render a `RichTextBlock`.

    **Example:**

    ```tsx
    import { hasRichTextBlockContent } from "@comet/cms-site";

    function TeaserBlock({ data: { image, text } }: PropsWithData<TeaserBlockData>) {
        return (
            <>
                <DamImageBlock data={image} />
                {hasRichTextBlockContent(text) && <RichTextBlock data={text} />}
            </>
        );
    }
    ```

## 5.3.0

## 5.2.0

### Minor Changes

-   6244d6cd: Add the `YouTubeVideoBlock` to the `@comet/cms-site` package.

## 5.1.0

## 5.0.0

## 4.7.0

## 4.6.0

## 4.5.0

## 4.4.3

## 4.4.2

## 4.4.1

## 4.4.0

## 4.3.0

## 4.2.0

## 4.1.0

### Patch Changes

-   51466b1a: Fix router.push() and router.replace() in site preview
