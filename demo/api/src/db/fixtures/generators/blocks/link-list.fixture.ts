import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { datatype } from "faker";

import { TextLinkBlockFixtureService } from "./text-link.fixture";

@Injectable()
export class LinkListBlockFixtureService {
    constructor(private readonly textLinkBlockFixtureService: TextLinkBlockFixtureService) {}

    async generateBlock(min = 2, max = 6): Promise<ExtractBlockInputFactoryProps<typeof LinkListBlock>> {
        const blockAmount = datatype.number({ min, max });
        const blocks = [];

        for (let i = 0; i < blockAmount; i++) {
            blocks.push({ key: datatype.uuid(), visible: true, props: await this.textLinkBlockFixtureService.generateBlock() });
        }

        return {
            blocks,
        };
    }
}
