import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { ColumnsBlock, supportedBlocks } from "@src/pages/blocks/columns.block";
import { datatype, random } from "faker";

import { ColumnsContentBlock } from "../../../../pages/blocks/columns.block";
import { DamImageBlockFixtureService } from "./dam-image.fixture";
import { HeadlineBlockFixtureService } from "./headline.fixture";
import { BlockFixture } from "./page-content.fixture";
import { RichTextBlockFixtureService } from "./richtext.fixture";
import { SpaceBlockFixtureService } from "./space.fixture";

@Injectable()
export class ColumnsBlockFixtureService {
    constructor(
        private readonly richtextBlockFixtureService: RichTextBlockFixtureService,
        private readonly damImageBlockFixture: DamImageBlockFixtureService,
        private readonly spaceBlockFixture: SpaceBlockFixtureService,
        private readonly headlineBlockFixture: HeadlineBlockFixtureService,
    ) {}

    async generateBlock(): Promise<ExtractBlockInputFactoryProps<typeof ColumnsBlock>> {
        const layoutTypes = ["one-column", "two-columns"];
        const columnCount = datatype.number({ min: 1, max: 2 });
        const layout = layoutTypes[columnCount - 1];
        const columns = [];

        for (let i = 0; i < columnCount; i++) {
            const blocks: ExtractBlockInputFactoryProps<typeof ColumnsContentBlock>["blocks"] = [];

            const blockCfg: Record<keyof typeof supportedBlocks, BlockFixture> = {
                space: this.spaceBlockFixture,
                richtext: this.richtextBlockFixtureService,
                headline: this.headlineBlockFixture,
                image: this.damImageBlockFixture,
            };

            for (let i = 0; i < datatype.number(20); i++) {
                const [type, generator] = random.arrayElement(Object.entries(blockCfg));
                if (generator) {
                    const props = await generator.generateBlock();

                    blocks.push({
                        key: String(i),
                        visible: datatype.boolean(),
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        type: type as any,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        props: props as any,
                    });
                }
            }
            columns.push({ key: datatype.uuid(), visible: datatype.boolean(), props: { blocks } });
        }

        return {
            columns,
            layout,
        };
    }
}
