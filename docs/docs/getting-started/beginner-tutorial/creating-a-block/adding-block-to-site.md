---
title: Adding Block to Site
sidebar_position: 3
---

# Step One: Creating the block in the site

Now, we will make sure our block and its content get rendered!

1. Let's add the hero block to the **site** as well, like this:

Inside `site/src/common/blocks`, create the file `HeroBlock.tsx` and insert the following code:

```ts title="HeroBlock.tsx"
import { PropsWithData, withPreview } from "@comet/cms-site";
import { HeroBlockData } from "@src/blocks.generated";

export const HeroBlock = withPreview(
    ({ data: { eyebrow, headline, text, textLink, image, imageSecondary } }: PropsWithData<HeroBlockData>) => {
        return (
          // Here we will output the individual blocks that we created earlier
        );
    },
    { label: "Hero" },
);
```

2. We want to return the blocks we created previously. Let's do this now!

<!-- In the following code block is an issue regarding syntax highlighting -->

```ts title="HeroBlock.tsx"
import { PropsWithData, withPreview } from "@comet/cms-site";
import { HeroBlockData } from "@src/blocks.generated";

import { DamImageBlock } from "./DamImageBlock";
import { HeadlineBlock } from "./HeadlineBlock";
import { RichTextBlock } from "./RichTextBlock";
import { TextLinkBlock } from "./TextLinkBlock";

export const HeroBlock = withPreview(
    ({
        data: { eyebrow, headline, text, textLink, image, imageSecondary },
    }: PropsWithData<HeroBlockData>) => {
        return (
            <>
                {eyebrow}
                <HeadlineBlock data={headline} />
                <RichTextBlock data={text} />
                <TextLinkBlock data={textLink} />
                <DamImageBlock data={image} />
                <DamImageBlock data={imageSecondary} />
            </>
        );
    },
    { label: "Hero" },
);
```

# Step Two: Registering in `PageContentBlock.tsx`

1. Open `site/src/documents/pages/blocks/PageContentBlock.tsx` and add the hero block to the supported blocks.

```ts title="PageContentBlock.tsx"
import { BlocksBlock, PropsWithData, SupportedBlocks } from "@comet/cms-site";
import { PageContentBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { DamVideoBlock } from "@src/common/blocks/DamVideoBlock";
import { HeadlineBlock } from "@src/common/blocks/HeadlineBlock";
import { HeroBlock } from "@src/common/blocks/HeroBlock";
import { LinkListBlock } from "@src/common/blocks/LinkListBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { SpaceBlock } from "@src/common/blocks/SpaceBlock";
import { TextImageBlock } from "@src/common/blocks/TextImageBlock";
import { YouTubeVideoBlock } from "@src/common/blocks/YouTubeVideoBlock";
import * as React from "react";

const supportedBlocks: SupportedBlocks = {
    space: (props) => <SpaceBlock data={props} />,
    richtext: (props) => <RichTextBlock data={props} />,
    headline: (props) => <HeadlineBlock data={props} />,
    image: (props) => <DamImageBlock data={props} />,
    textImage: (props) => <TextImageBlock data={props} />,
    damVideo: (props) => <DamVideoBlock data={props} />,
    youTubeVideo: (props) => <YouTubeVideoBlock data={props} />,
    links: (props) => <LinkListBlock data={props} />,
    hero: (props) => <HeroBlock data={props} />, // we are adding this line to register the new block
};

export const PageContentBlock: React.FC<PropsWithData<PageContentBlockData>> = ({ data }) => {
    return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
};
```

And that's it! Everything should work correctly now.
However, our block still looks quite basic and boring, don't you think? <br/>Let's get to the **styling**!
