---
"@comet/cms-site": minor
---

Add `hasRichTextBlockContent` helper

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
