# @comet/cms-site

## 5.8.4

## 5.8.3

## 5.8.2

## 5.8.1

## 5.8.0

## 5.7.2

## 5.7.1

## 5.7.0

## 5.6.6

## 5.6.5

## 5.6.4

## 5.6.3

## 5.6.2

## 5.6.1

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
