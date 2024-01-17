import { ExtractBlockInputFactoryProps, SpaceBlock } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import faker from "faker";

@Injectable()
export class SpaceBlockFixtureService {
    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof SpaceBlock>> {
        return { height: faker.datatype.number({ min: 20, max: 200 }) };
    }
}
