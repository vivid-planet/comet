# @comet/cms-site

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
