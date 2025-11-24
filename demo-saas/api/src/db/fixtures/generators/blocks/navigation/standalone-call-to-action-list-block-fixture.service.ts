import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import {
    Alignment as StandaloneCallToActionListBlockAlignment,
    StandaloneCallToActionListBlock,
} from "@src/common/blocks/standalone-call-to-action-list.block";

import { CallToActionListBlockFixtureService } from "./call-to-action-list-block.service";

@Injectable()
export class StandaloneCallToActionListBlockFixtureService {
    constructor(private readonly callToActionListBlockFixtureService: CallToActionListBlockFixtureService) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof StandaloneCallToActionListBlock>> {
        return {
            alignment: faker.helpers.arrayElement(Object.values(StandaloneCallToActionListBlockAlignment)),
            callToActionList: await this.callToActionListBlockFixtureService.generateBlockInput(),
        };
    }
}
