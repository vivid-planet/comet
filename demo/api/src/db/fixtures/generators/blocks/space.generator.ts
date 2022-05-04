import { ExtractBlockInputFactoryProps, SpaceBlock } from "@comet/api-blocks";
import faker from "faker";

export const generateSpaceBlock = (): ExtractBlockInputFactoryProps<typeof SpaceBlock> => ({ height: faker.datatype.number(200) });
