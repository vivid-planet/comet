import { type Block, type ExtractBlockInputFactoryProps } from "@comet/cms-api";

export type BlockFixture = { generateBlockInput: () => Promise<ExtractBlockInputFactoryProps<Block>> };
