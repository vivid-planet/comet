import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { HeadlineBlock, HeadlineLevel } from "@src/pages/blocks/headline.block";
import { datatype, random } from "faker";

import { RichTextBlockFixtureService } from "./richtext.fixture";

@Injectable()
export class HeadlineBlockFixtureService {
    constructor(private readonly richtextBlockFixtureService: RichTextBlockFixtureService) {}

    async generateBlock(): Promise<ExtractBlockInputFactoryProps<typeof HeadlineBlock>> {
        const richTextBlocks: ExtractBlockInputFactoryProps<typeof RichTextBlock>["draftContent"]["blocks"] = [];

        const keys = ["5jda2", "bifh7", "er118", "37lco", "5e7g4"];

        for (let i = 0; i < datatype.number({ min: 1, max: 5 }); i++) {
            richTextBlocks.push({
                key: keys[i],
                text: random.words(datatype.number({ min: 1, max: 20 })),
                type: "header-one",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            });
        }

        return {
            headline: await this.richtextBlockFixtureService.generateBlock(1, richTextBlocks),
            eyebrow: random.words(datatype.number({ min: 1, max: 5 })),
            level: random.arrayElement(Object.values(HeadlineLevel)),
        };
    }
}
