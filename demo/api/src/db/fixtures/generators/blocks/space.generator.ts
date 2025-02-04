import { type ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { type SpaceBlock, Spacing } from "@src/common/blocks/space.block";

export const generateSpaceBlock = (): ExtractBlockInputFactoryProps<typeof SpaceBlock> => ({ spacing: Spacing.D200 });
