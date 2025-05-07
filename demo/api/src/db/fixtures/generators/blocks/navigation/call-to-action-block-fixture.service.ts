import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { CallToActionBlock, Variant as CallToActionVariant } from "@src/common/blocks/call-to-action.block";

import { TextLinkBlockFixtureService } from "./text-link-block-fixture.service";

@Injectable()
export class CallToActionBlockFixtureService {
    constructor(private readonly textLinkBlockFixtureService: TextLinkBlockFixtureService) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof CallToActionBlock>> {
        return {
            textLink: await this.textLinkBlockFixtureService.generateBlockInput(),
            variant: faker.helpers.arrayElement(Object.values(CallToActionVariant)),
        };
    }
}
