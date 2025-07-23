import { AnchorBlock, ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AnchorBlockFixtureService {
    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof AnchorBlock>> {
        return {
            name: faker.word.words(3),
        };
    }
}
