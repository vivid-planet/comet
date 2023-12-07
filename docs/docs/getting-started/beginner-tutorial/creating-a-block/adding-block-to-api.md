---
title: Adding Block to API
sidebar_position: 5
---

Here you can find out what exactly we are doing here // Rephrase this
Link: https://docs.comet-dxp.com/docs/blocks/your-first-block#part-one-creating-the-block-in-the-api


# Step One: Defining the block data

First, we will define the block data inside the API.

1. In your editor, move into the **api/src/common/blocks.** directory.

Inside this directory, all your blocks will be stored for the API part. // Change wording

2. Create a file called **hero.block.ts**.

3. In here, declare a class called **HeroBlockData**, which extends BlockData, like the following:

```javascript
import { BlockData } from "@comet/blocks-api";

class HeroBlockData extends BlockData {
 // Here we will define our block
}
```

We will start by adding the eyebrow (the text above the headline, siehe screenshot) to our API.

4. Add this code inside your class. // Noch herzeigen, wie mand das Feld optional macht

```javascript
import { BlockData, BlockField } from "@comet/blocks-api";

class HeroBlockData extends BlockData {
@BlockField() // Decorator that automatically generates TypeScript interfaces for the block
eyebrow: string; // The field can be named however you like but has to concide with the name inside X later on.
}
```

5. Take a look at the directory we are in right now.
As you can see, this directory already has a file called **headline.block.ts**. 
This means a headline block already exists. We can utilize inside our hero block!

6. Beneath the eyebrow, add the headline like the following:

```javascript
import { BlockData, BlockDataInterface, BlockField, ChildBlock } from "@comet/blocks-api";

import { HeadlineBlock } from "./headline.block";
import { RichTextBlock } from "./rich-text.block";

class HeroBlockData extends BlockData {
    @BlockField()
    eyebrow: string;

    @ChildBlock(HeadlineBlock) // since the block already exists, we are using @ChildBlock that makes use of the HeadlineBlock
    headline: BlockDataInterface; // short explanation for BlockDataInterface?
}
```

// Unterschied zwischen BlockField und ChildBlock erklären?

7. Now try to add the paragraph beneath the headline by yourself! The pre-existing **RichTextBlock** is a good fit here.

(Toggle Solution)
```javascript
import { BlockData, BlockDataInterface, BlockField, ChildBlock } from "@comet/blocks-api";

import { HeadlineBlock } from "./headline.block";
import { RichTextBlock } from "./rich-text.block";

class HeroBlockData extends BlockData {
    @BlockField()
    eyebrow: string;

    @ChildBlock(HeadlineBlock)
    headline: BlockDataInterface;

    @ChildBlock(RichTextBlock)
    text: BlockDataInterface;
}
```

8. // Später hier evtl. noch den Button und das Bild einfuegen

# Step Two: Defining the Block Input

In most cases, the block input looks almost identical to the block data.

1. Inside the same file, below our HeroBlockData class, declare a new class called HeroBlockInput that extends BlockInput and add our blocks. // einen step mehr einfügen für den Content der Klasse? / auch noch herzeigen wie mans optional macht

```javascript
import { BlockData, BlockDataInterface, BlockField, BlockInput, ChildBlock, ChildBlockInput, ExtractBlockInput } from "@comet/blocks-api";
import { IsString, ValidateNested } from "class-validator";

import { HeadlineBlock } from "./headline.block";
import { RichTextBlock } from "./rich-text.block";

class HeroBlockInput extends BlockInput {
    @IsString() // class-validator
    @BlockField() // use @BlockField for a new block/element
    eyebrow: string;

    @ValidateNested() // class-validator
    @ChildBlockInput(HeadlineBlock) // use @ChildBlockInput for a pre-existent block/element
    headline: ExtractBlockInput<typeof HeadlineBlock>; // Short Explanation here?

    @ValidateNested() // class-validator
    @ChildBlockInput(RichTextBlock)
    text: ExtractBlockInput<typeof RichTextBlock>; // Short Explanation here?
}
```
Entire Documentation for class-validator: https://github.com/typestack/class-validator
List of validation decorators: https://github.com/typestack/class-validator#validation-decorators


2. Now, we need to add the pre-defined method **transformToBlockData** inside our **HeroBlockInput** class

```javascript
class HeroBlockInput extends BlockInput {
    @IsString()
    @BlockField()
    eyebrow: string;

    @ValidateNested()
    @ChildBlockInput(HeadlineBlock)
    headline: ExtractBlockInput<typeof HeadlineBlock>;

    @ValidateNested()
    @ChildBlockInput(RichTextBlock)
    text: ExtractBlockInput<typeof RichTextBlock>;

    // Add this function, which transforms the block input into the block data
    transformToBlockData(): HeroBlockData {
        return inputToData(HeroBlockData, this); // inputToData() does this for us automatically
    }
}
```

3. Create and export the block beneath our two classes like this:
This will be the file in its final form. // Rephrase

```javascript
import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
} from "@comet/blocks-api";
import { IsString, ValidateNested } from "class-validator";

import { HeadlineBlock } from "./headline.block";
import { RichTextBlock } from "./rich-text.block";

class HeroBlockData extends BlockData {
    @BlockField()
    eyebrow: string;

    @ChildBlock(HeadlineBlock)
    headline: BlockDataInterface;

    @ChildBlock(RichTextBlock)
    text: BlockDataInterface;
}

class HeroBlockInput extends BlockInput {
    @IsString()
    @BlockField()
    eyebrow: string;

    @ValidateNested()
    @ChildBlockInput(HeadlineBlock)
    headline: ExtractBlockInput<typeof HeadlineBlock>;

    @ValidateNested()
    @ChildBlockInput(RichTextBlock)
    text: ExtractBlockInput<typeof RichTextBlock>;
}

// Export / Block Creation
export const HeroBlock = createBlock(HeroBlockData, HeroBlockInput, "Hero"); // Where is the name "Hero" utilized?
```

# Step Three: Registering the Block in api/page-content.block.ts
1. Go to **api/src/documents/pages/blocks** and open the file **page-content.block.ts**. Here we are registering our Hero block like this:

```javascript
import { createBlocksBlock, SpaceBlock, YouTubeVideoBlock } from "@comet/blocks-api";
import { DamImageBlock, DamVideoBlock } from "@comet/cms-api";
import { HeadlineBlock } from "@src/common/blocks/headline.block";
import { HeroBlock } from "@src/common/blocks/hero.block";
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { TextImageBlock } from "@src/common/blocks/text-image.block";

export const PageContentBlock = createBlocksBlock(
    {
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
    },
    "PageContent",
);
```

This concludes the API. Let's move on to the admin.