import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { TextLinkBlock } from "@src/common/blocks/text-link.block";
import { datatype, random } from "faker";

import { LinkBlockFixtureService } from "./link.fixture";

@Injectable()
export class TextLinkBlockFixtureService {
    constructor(private readonly linkBlockFixtureService: LinkBlockFixtureService) {}

    async generateBlock(): Promise<ExtractBlockInputFactoryProps<typeof TextLinkBlock>> {
        return {
            text: random.words(datatype.number({ min: 1, max: 5 })),
            link: await this.linkBlockFixtureService.generateBlock(),
        };
    }
}
