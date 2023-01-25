import { ExtractBlockInputFactoryProps } from "../block";
import { SpaceBlock } from "../SpaceBlock/SpaceBlock";

export const generateSpaceBlock = (): ExtractBlockInputFactoryProps<typeof SpaceBlock> => ({ height: 200 });
