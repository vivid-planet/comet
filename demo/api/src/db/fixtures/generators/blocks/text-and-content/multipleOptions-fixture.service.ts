import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { MultipleOptionsBlock, Option } from "@src/common/blocks/multiple-options.block";

@Injectable()
export class MultipleOptionsFixtureService {
    constructor() {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof MultipleOptionsBlock>> {
        return {
            options: faker.helpers.arrayElements(Object.values(Option)),
        };
    }
}
