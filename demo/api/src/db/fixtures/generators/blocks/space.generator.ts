import { ExtractBlockInputFactoryProps, SpaceBlock } from "@comet/blocks-api";
import faker from "faker";

export const generateSpaceBlock = (): ExtractBlockInputFactoryProps<typeof SpaceBlock> => ({ height: faker.datatype.number(200) });
