import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { ContactFormBlock } from "@src/common/blocks/contact-form.block";

@Injectable()
export class ContactFormBlockFixtureService {
    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof ContactFormBlock>> {
        return {};
    }
}
