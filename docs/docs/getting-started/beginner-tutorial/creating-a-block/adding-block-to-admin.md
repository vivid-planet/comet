---
title: Adding Block to Admin
sidebar_position: 5
---

# Step One: Creating the block in admin

We will use the method **createCompositeBlock** to create our hero block in the admin.

1. Go to the **admin/src/common/blocks** directory and create a file called **HeroBlock.tsx**

2. Add the following code to your file

```javascript
import { BlockCategory, createCompositeBlock } from "@comet/blocks-admin";

export const HeroBlock = createCompositeBlock({
    name: "Hero", // where is this name used?
    displayName: "Hero", // the name that will be displayed in the admin?
    category: BlockCategory.TextAndContent, // The category the block belongs to 
    blocks: {}, // Inside here, we will list all blocks we previously defined
});
```


3. Let's fill in the content for **blocks{}** // Rephrase

```javascript
import { FinalFormInput } from "@comet/admin";
import { BlockCategory, BlocksFinalForm, createCompositeBlock, createCompositeSetting } from "@comet/blocks-admin";
import { HeroBlockData } from "@src/blocks.generated";
import React from "react";
import { Field } from "react-final-form";

import { HeadlineBlock } from "./HeadlineBlock";
import { RichTextBlock } from "./RichTextBlock";

export const HeroBlock = createCompositeBlock({
    name: "Hero",
    displayName: "Hero",
    category: BlockCategory.TextAndContent,
    blocks: {
        // this name must be the exact same as the fields in the api
        eyebrow: {
            block: createCompositeSetting<HeroBlockData["eyebrow"]>({
                defaultValue: "eyebrow",
                AdminComponent: ({ state, updateState }) => (
                    <BlocksFinalForm<Pick<HeroBlockData, "eyebrow">>
                        onSubmit={({ eyebrow }) => updateState(eyebrow)}
                        initialValues={{ eyebrow: state }}
                    >
                        <Field name="eyebrow" label="Eyebrow" component={FinalFormInput} fullWidth />
                    </BlocksFinalForm>
                ),
            }),
        },
        // this name must be the exact same as the fields in the api
        headline: {
            block: HeadlineBlock, // pre-existent headline block
        },
        // this name must be the exact same as the fields in the api
        text: {
            block: RichTextBlock, // pre-existent richtext block
        },
    },
});

// which options are there instead of createCompositeBlock and createCompositeSetting, when to use
// Does AdminComponent always need to be used when creating a new block?
// FinalFormInput Doku verlinken?
```

# Step Two: Registering the block in admin/PageContentBlock.tsx
Like we have done with the API, we need to register the block in the page document in admin this time.

1. Open the file **PageContentBlock.tsx** inside **admin/src/documents/pages/blocks** and register the hero block.

(TOGGLE SOLUTION)

```javascript
import { createBlocksBlock, SpaceBlock, YouTubeVideoBlock } from "@comet/blocks-admin";
import { DamImageBlock, DamVideoBlock } from "@comet/cms-admin";
import { HeadlineBlock } from "@src/common/blocks/HeadlineBlock";
import { HeroBlock } from "@src/common/blocks/HeroBlock";
import { LinkListBlock } from "@src/common/blocks/LinkListBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { TextImageBlock } from "@src/common/blocks/TextImageBlock";

export const PageContentBlock = createBlocksBlock({
    name: "PageContent",
    supportedBlocks: {
        space: SpaceBlock,
        richtext: RichTextBlock,
        headline: HeadlineBlock,
        image: DamImageBlock,
        textImage: TextImageBlock,
        damVideo: DamVideoBlock,
        youTubeVideo: YouTubeVideoBlock,
        links: LinkListBlock,
        hero: HeroBlock, // our newly added hero block
    },
});
```


After this step, you will already be able to see the Hero Block in the admin. Go try it out!