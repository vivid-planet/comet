import { ExternalLinkBlock, ExtractBlockInput } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { LinkBlock } from "@src/common/blocks/linkBlock/link.block";
import { datatype, random } from "faker";

@Injectable()
export class LinkBlockFixtureService {
    async generateBlock(): Promise<ExtractBlockInput<typeof LinkBlock>> {
        const externalLinkUrls = ["https://www.comet-dxp.com/", "https://docs.comet-dxp.com/", "https://vivid-planet.com/"];

        // TODO: Internal Link
        return LinkBlock.blockInputFactory({
            attachedBlocks: [
                {
                    type: "external",
                    props: ExternalLinkBlock.blockDataFactory({
                        targetUrl: random.arrayElement(externalLinkUrls),
                        openInNewWindow: datatype.boolean(),
                    }),
                },
            ],
            activeType: "external",
        });
    }
}
