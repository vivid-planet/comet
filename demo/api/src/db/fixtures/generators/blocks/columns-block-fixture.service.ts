import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { ColumnsBlock, supportedBlocks } from "@src/pages/blocks/columns.block";
import { datatype, random } from "faker";

import { ColumnsContentBlock } from "../../../../pages/blocks/columns.block";
import { DamImageBlockFixtureService } from "./dam-image-block-fixture.service";
import { HeadlineBlockFixtureService } from "./headline-block-fixture.service";
import { BlockFixture } from "./page-content-block-fixture.service";
import { RichTextBlockFixtureService } from "./richtext-block-fixture.service";
import { SpaceBlockFixtureService } from "./space-block-fixture.service";

@Injectable()
export class ColumnsBlockFixtureService {
    constructor(
        private readonly richtextBlockFixtureService: RichTextBlockFixtureService,
        private readonly damImageBlockFixtureService: DamImageBlockFixtureService,
        private readonly spaceBlockFixtureService: SpaceBlockFixtureService,
        private readonly headlineBlockFixtureService: HeadlineBlockFixtureService,
    ) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof ColumnsBlock>> {
        const layoutTypes = ["one-column", "two-columns"];
        const columnCount = datatype.number({ min: 1, max: 2 });
        const layout = layoutTypes[columnCount - 1];
        const columns = [];

        for (let i = 0; i < columnCount; i++) {
            const blocks: ExtractBlockInputFactoryProps<typeof ColumnsContentBlock>["blocks"] = [];

            const supportedBlocksFixtureGenerators: Record<keyof typeof supportedBlocks, BlockFixture> = {
                space: this.spaceBlockFixtureService,
                richtext: this.richtextBlockFixtureService,
                headline: this.headlineBlockFixtureService,
                image: this.damImageBlockFixtureService,
            };

            for (let i = 0; i < datatype.number(20); i++) {
                const [type, generator] = random.arrayElement(Object.entries(supportedBlocksFixtureGenerators));
                if (generator) {
                    const props = await generator.generateBlockInput();

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
