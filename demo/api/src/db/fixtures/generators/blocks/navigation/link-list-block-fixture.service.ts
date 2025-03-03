import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { TextLinkBlockFixtureService } from "@src/db/fixtures/generators/blocks/navigation/text-link-block-fixture.service";

@Injectable()
export class LinkListBlockFixtureService {
    constructor(private readonly textLinkBlockFixtureService: TextLinkBlockFixtureService) {}

    async generateBlockInput(min = 1, max = 4): Promise<ExtractBlockInputFactoryProps<typeof LinkListBlock>> {
        const blockAmount = faker.number.int({ min, max });
        const blocks = [];

        for (let i = 0; i < blockAmount; i++) {
            blocks.push({
                key: faker.string.uuid(),
                visible: true,
                props: await this.textLinkBlockFixtureService.generateBlockInput(),
            });
        }

        return {
            blocks: blocks,
        };
    }
}
