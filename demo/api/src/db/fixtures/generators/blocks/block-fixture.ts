import type { Block, ExtractBlockInputFactoryProps } from "@comet/cms-api";

export type BlockFixture = { generateBlockInput: () => Promise<ExtractBlockInputFactoryProps<Block>> };
