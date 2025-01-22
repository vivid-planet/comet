import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { BackgroundColor as ContentGroupBackgroundColor, ContentGroupBlock } from "@src/documents/pages/blocks/content-group.block";

import { ContentGroupContentBlockFixtureService } from "./content-group-content-block-fixture.service";

@Injectable()
export class ContentGroupBlockFixtureService {
    constructor(private readonly contentGroupContentBlockFixtureService: ContentGroupContentBlockFixtureService) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof ContentGroupBlock>> {
        return {
            backgroundColor: faker.helpers.arrayElement(Object.values(ContentGroupBackgroundColor)),
            content: await this.contentGroupContentBlockFixtureService.generateBlockInput(),
        };
    }
}
