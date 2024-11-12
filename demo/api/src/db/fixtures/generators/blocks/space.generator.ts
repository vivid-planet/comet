import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { SpaceBlock, Spacing } from "@src/common/blocks/space.block";

export const generateSpaceBlock = (): ExtractBlockInputFactoryProps<typeof SpaceBlock> => ({ spacing: Spacing.d200 });
