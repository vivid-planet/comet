import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { LinkBlockFixtureService } from "@src/db/fixtures/generators/blocks/navigation/link-block-fixture.service";

type RichTextInput = ExtractBlockInputFactoryProps<typeof RichTextBlock>;

type ColumnSize = "extraSmall" | "small" | "standard" | "large" | "extraLarge";

interface TableColumnInput {
    id: string;
    size: ColumnSize;
    highlighted: boolean;
}

interface TableCellValueInput {
    columnId: string;
    value: RichTextInput;
}

interface TableRowInput {
    id: string;
    highlighted: boolean;
    cellValues: TableCellValueInput[];
}

interface TableBlockInput {
    columns: TableColumnInput[];
    rows: TableRowInput[];
}

const columnIds = {
    name: "name",
    email: "email",
    address: "address",
    description: "description",
} as const;

@Injectable()
export class TableBlockFixtureService {
    constructor(private readonly linkBlockFixtureService: LinkBlockFixtureService) {}

    async generateBlockInput(): Promise<TableBlockInput> {
        const columns: TableColumnInput[] = [
            { id: columnIds.name, size: "standard", highlighted: false },
            { id: columnIds.email, size: "standard", highlighted: false },
            { id: columnIds.address, size: "large", highlighted: false },
            { id: columnIds.description, size: "extraLarge", highlighted: false },
        ];

        const headerRow: TableRowInput = {
            id: faker.string.uuid(),
            highlighted: true,
            cellValues: [
                { columnId: columnIds.name, value: this.generateSimpleCellRichText("Name") },
                { columnId: columnIds.email, value: this.generateSimpleCellRichText("Email") },
                { columnId: columnIds.address, value: this.generateSimpleCellRichText("Address") },
                { columnId: columnIds.description, value: this.generateSimpleCellRichText("Description") },
            ],
        };

        const dataRowCount = faker.number.int({ min: 4, max: 5 });
        const dataRows = await Promise.all(Array.from({ length: dataRowCount }, () => this.generateDataRow()));

        return { columns, rows: [headerRow, ...dataRows] };
    }

    private async generateDataRow(): Promise<TableRowInput> {
        return {
            id: faker.string.uuid(),
            highlighted: false,
            cellValues: [
                { columnId: columnIds.name, value: this.generateSimpleCellRichText(faker.person.fullName()) },
                { columnId: columnIds.email, value: this.generateSimpleCellRichText(faker.internet.email()) },
                { columnId: columnIds.address, value: this.generateSimpleCellRichText(faker.location.streetAddress({ useFullAddress: true })) },
                { columnId: columnIds.description, value: await this.generateDescriptionCellRichText() },
            ],
        };
    }

    generateSimpleCellRichText(text: string): RichTextInput {
        return {
            draftContent: {
                blocks: [
                    {
                        key: faker.string.uuid(),
                        text,
                        type: "paragraph-standard",
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
                entityMap: {},
            },
        };
    }

    async generateDescriptionCellRichText(): Promise<RichTextInput> {
        const jobTitle = faker.person.jobTitle();
        const linkText = faker.lorem.words(3);
        const sentencePrefix = `${faker.lorem.words(faker.number.int({ min: 3, max: 6 }))} `;
        const sentenceSuffix = ` ${faker.lorem.words(faker.number.int({ min: 3, max: 6 }))}`;
        const linkData = await this.linkBlockFixtureService.generateBlockInput();

        return {
            draftContent: {
                blocks: [
                    {
                        key: faker.string.uuid(),
                        text: jobTitle,
                        type: "paragraph-standard",
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                    {
                        key: faker.string.uuid(),
                        text: `${sentencePrefix}${linkText}${sentenceSuffix}`,
                        type: "paragraph-small",
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [
                            {
                                offset: sentencePrefix.length,
                                length: linkText.length,
                                key: 0,
                            },
                        ],
                        data: {},
                    },
                ],
                entityMap: {
                    "0": {
                        type: "LINK",
                        mutability: "MUTABLE",
                        data: linkData,
                    },
                },
            },
        };
    }
}
