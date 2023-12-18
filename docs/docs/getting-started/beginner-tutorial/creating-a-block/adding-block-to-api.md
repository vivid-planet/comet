---
title: Adding Block to API
sidebar_position: 1
---

Read about the purpose of the application's API part [here](https://docs.comet-dxp.com/docs/blocks/your-first-block#part-one-creating-the-block-in-the-api).

# Step One: Defining the block data

First, we will define the block data inside the API.

1. In your editor, move into the `api/src/common/blocks` directory.

This is where the blocks are located within the API.

2. Create a file called `hero.block.ts`.

3. In here, declare a class called `HeroBlockData`, which extends the class `BlockData`, like the following:

```ts title="hero.block.ts"
import { BlockData } from "@comet/blocks-api";

class HeroBlockData extends BlockData {
    // Here we will define our block
}
```

We will start by adding the **eyebrow** element to our API.

4. Add the following code to your class:

```ts title="hero.block.ts"
import { BlockData, BlockField } from "@comet/blocks-api";

class HeroBlockData extends BlockData {
    @BlockField() // Decorator that automatically generates TypeScript interfaces for the block
    eyebrow: string; // The field can be named however you like but has to concide with the name inside the admin later on
}
```

We may not want to specify an eyebrow every time we use the `Hero` block. Therefore, we will make this field **optional**:

```ts title="hero.block.ts"
import { BlockData, BlockField } from "@comet/blocks-api";

class HeroBlockData extends BlockData {
    @BlockField()
    eyebrow?: string;
}
```

5. Take a look at the directory we are in right now.

    As you can see, this directory stores a file called `headline.block.ts`.
    This means a headline block already exists. We can utilize it inside our hero block!

6. Beneath the eyebrow, add the **headline** like the following:

```ts title="hero.block.ts"
import { BlockData, BlockDataInterface, BlockField, ChildBlock } from "@comet/blocks-api";

import { HeadlineBlock } from "./headline.block";

class HeroBlockData extends BlockData {
    @BlockField({ nullable: true })
    eyebrow?: string;

    @ChildBlock(HeadlineBlock) // since this block already exists, we are using @ChildBlock that makes use of the HeadlineBlock
    headline: BlockDataInterface; // short explanation for BlockDataInterface?
}
```

<!-- Explain difference between BlockField and ChildBlock? -->

7. Now try to add the **paragraph** beneath the headline on your own! The pre-existing `RichTextBlock` is a good fit here.

<details>
    <summary>Solution</summary>

```ts title="hero.block.ts"
import { BlockData, BlockDataInterface, BlockField, ChildBlock } from "@comet/blocks-api";

import { HeadlineBlock } from "./headline.block";
import { RichTextBlock } from "./rich-text.block";

class HeroBlockData extends BlockData {
    @BlockField({ nullable: true })
    eyebrow?: string;

    @ChildBlock(HeadlineBlock)
    headline: BlockDataInterface;

    // Paragraph
    @ChildBlock(RichTextBlock)
    text: BlockDataInterface;
}
```

</details>

8. Well done! Now add the button, for which we can utilize the `TextLinkBlock`.

<details>
    <summary>Solution</summary>

```ts title="hero.block.ts"
import { BlockData, BlockDataInterface, BlockField, ChildBlock } from "@comet/blocks-api";

import { HeadlineBlock } from "./headline.block";
import { RichTextBlock } from "./rich-text.block";
import { TextLinkBlock } from "./text-link.block";

class HeroBlockData extends BlockData {
    @BlockField({ nullable: true })
    eyebrow?: string;

    @ChildBlock(HeadlineBlock)
    headline: BlockDataInterface;

    @ChildBlock(RichTextBlock)
    text: BlockDataInterface;

    // Button
    @ChildBlock(TextLinkBlock)
    textLink: BlockDataInterface;
}
```

</details>

9. Lastly, we are adding the two **images**. <br/>
   To achieve this, we use the pre-existent `DamImageBlock`, which allows us to upload and use an image from COMET's [asset manager](https://docs.comet-dxp.com/docs/asset-management/).

```ts title="hero.block.ts"
import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { DamImageBlock } from "@comet/cms-api";
import { IsString, ValidateNested } from "class-validator";

import { HeadlineBlock } from "./headline.block";
import { RichTextBlock } from "./rich-text.block";
import { TextLinkBlock } from "./text-link.block";

class HeroBlockData extends BlockData {
    @BlockField()
    eyebrow?: string;

    @ChildBlock(HeadlineBlock)
    headline: BlockDataInterface;

    @ChildBlock(RichTextBlock)
    text: BlockDataInterface;

    @ChildBlock(TextLinkBlock)
    textLink: BlockDataInterface;

    // The newly added image blocks
    @ChildBlock(DamImageBlock)
    image: BlockDataInterface;

    @ChildBlock(DamImageBlock)
    imageSecondary: BlockDataInterface;
}
```

# Step Two: Defining the Block Input

In most cases, the block input looks almost identical to the block data. <br/>
We are using the package [class-validator](https://github.com/typestack/class-validator) here.
[Here](https://github.com/typestack/class-validator#validation-decorators) you can find the complete list of validation decorators.

1. Inside the same file, below our `HeroBlockData` class, declare a new class called `HeroBlockInput` that extends `BlockInput` and add our blocks:

```ts title="hero.block.ts"
import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    ExtractBlockInput,
} from "@comet/blocks-api";
import { IsString, ValidateNested } from "class-validator";

import { HeadlineBlock } from "./headline.block";
import { RichTextBlock } from "./rich-text.block";

class HeroBlockInput extends BlockInput {
    @IsOptional() // class-validator
    @IsString() // class-validator
    @BlockField() // use @BlockField for a new block/element
    eyebrow?: string;

    @ValidateNested() // class-validator
    @ChildBlockInput(HeadlineBlock) // use @ChildBlockInput for a pre-existent block/element
    headline: ExtractBlockInput<typeof HeadlineBlock>; // Short Explanation here?

    @ValidateNested() // class-validator
    @ChildBlockInput(RichTextBlock)
    text: ExtractBlockInput<typeof RichTextBlock>; // Short Explanation here?
}
```

2. Try to add the **button** and the **images** to `HeroBlockInput` on your own!

<details>
    <summary>Solution</summary>

```ts title="hero.block.ts"
import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    ExtractBlockInput,
} from "@comet/blocks-api";
import { IsString, ValidateNested } from "class-validator";

import { HeadlineBlock } from "./headline.block";
import { RichTextBlock } from "./rich-text.block";

class HeroBlockInput extends BlockInput {
    @IsOptional()
    @IsString()
    @BlockField()
    eyebrow?: string;

    @ValidateNested()
    @ChildBlockInput(HeadlineBlock)
    headline: ExtractBlockInput<typeof HeadlineBlock>;

    @ValidateNested()
    @ChildBlockInput(RichTextBlock)
    text: ExtractBlockInput<typeof RichTextBlock>;

    // Newly added button and images
    @ValidateNested()
    @ChildBlockInput(TextLinkBlock)
    textLink: ExtractBlockInput<typeof TextLinkBlock>;

    @ValidateNested()
    @ChildBlockInput(DamImageBlock)
    image: ExtractBlockInput<typeof DamImageBlock>;

    @ValidateNested()
    @ChildBlockInput(DamImageBlock)
    imageSecondary: ExtractBlockInput<typeof DamImageBlock>;
}
```

</details>

3. Now, we need to add the pre-defined method `transformToBlockData` to our `HeroBlockInput` class:

```ts title="hero.block.ts"
import { inputToData } from "@comet/blocks-api";

class HeroBlockInput extends BlockInput {
    @IsOptional()
    @IsString()
    @BlockField()
    eyebrow?: string;

    @ValidateNested()
    @ChildBlockInput(HeadlineBlock)
    headline: ExtractBlockInput<typeof HeadlineBlock>;

    @ValidateNested()
    @ChildBlockInput(RichTextBlock)
    text: ExtractBlockInput<typeof RichTextBlock>;

    @ValidateNested()
    @ChildBlockInput(TextLinkBlock)
    textLink: ExtractBlockInput<typeof TextLinkBlock>;

    @ValidateNested()
    @ChildBlockInput(DamImageBlock)
    image: ExtractBlockInput<typeof DamImageBlock>;

    @ValidateNested()
    @ChildBlockInput(DamImageBlock)
    imageSecondary: ExtractBlockInput<typeof DamImageBlock>;

    // Add this function, which transforms the block input into the block data
    transformToBlockData(): HeroBlockData {
        return inputToData(HeroBlockData, this); // inputToData() does this for us automatically
    }
}
```

4. **Create** and **export** the block beneath our two classes like the following. This will be the final content of our file.

```ts title="hero.block.ts"
import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { IsString, ValidateNested } from "class-validator";

import { HeadlineBlock } from "./headline.block";
import { RichTextBlock } from "./rich-text.block";

class HeroBlockData extends BlockData {
    @BlockField()
    eyebrow?: string;

    @ChildBlock(HeadlineBlock)
    headline: BlockDataInterface;

    @ChildBlock(RichTextBlock)
    text: BlockDataInterface;

    @ChildBlock(TextLinkBlock)
    textLink: BlockDataInterface;

    @ChildBlock(DamImageBlock)
    image: BlockDataInterface;

    @ChildBlock(DamImageBlock)
    imageSecondary: BlockDataInterface;
}

class HeroBlockInput extends BlockInput {
    @IsOptional()
    @IsString()
    @BlockField()
    eyebrow?: string;

    @ValidateNested()
    @ChildBlockInput(HeadlineBlock)
    headline: ExtractBlockInput<typeof HeadlineBlock>;

    @ValidateNested()
    @ChildBlockInput(RichTextBlock)
    text: ExtractBlockInput<typeof RichTextBlock>;

    @ValidateNested()
    @ChildBlockInput(TextLinkBlock)
    textLink: ExtractBlockInput<typeof TextLinkBlock>;

    @ValidateNested()
    @ChildBlockInput(DamImageBlock)
    image: ExtractBlockInput<typeof DamImageBlock>;

    @ValidateNested()
    @ChildBlockInput(DamImageBlock)
    imageSecondary: ExtractBlockInput<typeof DamImageBlock>;

    transformToBlockData(): HeroBlockData {
        return inputToData(HeroBlockData, this);
    }
}

// Export / Block Creation
export const HeroBlock = createBlock(HeroBlockData, HeroBlockInput, "Hero");
```

# Step Three: Registering the Block in `page-content.block.ts`

1. Go to `api/src/documents/pages/blocks` and open the file `page-content.block.ts`. <br/>
   Here we are registering our `Hero` block like this:

```ts title="page-content.block.ts"
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

This concludes the API. Let's move on to the **admin**!
