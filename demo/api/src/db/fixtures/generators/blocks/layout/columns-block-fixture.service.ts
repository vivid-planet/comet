import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { ColumnsBlock } from "@src/documents/pages/blocks/columns.block";

import { ColumnsContentBlockFixtureService } from "./columns-content-block-fixture.service";

const twoColumnLayouts = [{ name: "9-9" }];
const threeColumnLayouts = [{ name: "5-5-5" }, { name: "6-6-6" }];
const fourColumnLayouts = [{ name: "5-5-5-5" }];

@Injectable()
export class ColumnsBlockFixtureService {
    constructor(private readonly columnsContentBlockFixtureService: ColumnsContentBlockFixtureService) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof ColumnsBlock>[]> {
        const content = await this.columnsContentBlockFixtureService.generateBlockInput();

        return [
            {
                layout: faker.helpers.arrayElement(twoColumnLayouts).name,
                columns: [
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                ],
            },
            {
                layout: faker.helpers.arrayElement(threeColumnLayouts).name,
                columns: [
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                ],
            },
            {
                layout: faker.helpers.arrayElement(fourColumnLayouts).name,
                columns: [
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                ],
            },
        ];
    }
}
