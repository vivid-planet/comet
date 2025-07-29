import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { LinkBlock } from "@src/common/blocks/link.block";

const urls = ["https://vivid-planet.com/", "https://github.com/", "https://gitlab.com", "https://stackoverflow.com/"];

@Injectable()
export class LinkBlockFixtureService {
    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof LinkBlock>> {
        return {
            attachedBlocks: [
                {
                    type: "external",
                    props: {
                        targetUrl: faker.helpers.arrayElement(urls),
                        openInNewWindow: faker.datatype.boolean(),
                    },
                },
            ],
            activeType: "external",
        };
    }
}
