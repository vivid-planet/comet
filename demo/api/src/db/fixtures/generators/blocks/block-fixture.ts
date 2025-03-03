import { Block, ExtractBlockInputFactoryProps } from "@comet/blocks-api";

export type BlockFixture = { generateBlockInput: () => Promise<ExtractBlockInputFactoryProps<Block>> };
