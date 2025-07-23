import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { SpaceBlock, Spacing } from "@src/common/blocks/space.block";

@Injectable()
export class SpaceBlockFixtureService {
    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof SpaceBlock>> {
        return { spacing: faker.helpers.arrayElement(Object.values(Spacing)) };
    }
}
