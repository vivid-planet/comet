import { ExtractBlockInputFactoryProps, PageTreeNodeVisibility, PageTreeService, TipTapRichTextBlockContent } from "@dextinity/cms-api";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { LinkBlock } from "@src/common/blocks/link.block";
import { TipTapRichTextBlock } from "@src/common/blocks/tip-tap-rich-text.block";
import { faker } from "@src/db/fixtures/faker";
import { LinkBlockFixtureService } from "@src/db/fixtures/generators/blocks/navigation/link-block-fixture.service";
import { PageContentBlock } from "@src/documents/pages/blocks/page-content.block";
import { StageBlock } from "@src/documents/pages/blocks/stage.block";
import { PageInput } from "@src/documents/pages/dto/page.input";
import { Page } from "@src/documents/pages/entities/page.entity";
import { PageTreeNodeCreateInput } from "@src/page-tree/dto/page-tree-node.input";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import { UserGroup } from "@src/user-groups/user-group";

import { generateSeoBlock } from "./blocks/seo.generator";

type RichTextInput = ExtractBlockInputFactoryProps<typeof TipTapRichTextBlock>;
type LinkInput = ExtractBlockInputFactoryProps<typeof LinkBlock>;
type TipTapNode = TipTapRichTextBlockContent;
type TipTapMark = NonNullable<TipTapNode["marks"]>[number];
type TextBlockStyle = "paragraph300" | "paragraph200" | "eyebrow600" | "eyebrow550" | "eyebrow500" | "eyebrow450";
type ListStyle = "list300" | "list200";

const COLUMN_COUNT = 12;
const DATA_ROW_COUNT = 60;
const LINK_POOL_SIZE = 8;
const HEADING_LEVEL_COUNT = 6;

const columnSizes = ["extraSmall", "small", "standard", "large", "extraLarge"];
const eyebrowStyles: TextBlockStyle[] = ["eyebrow600", "eyebrow550", "eyebrow500", "eyebrow450"];

const bold: TipTapMark = { type: "bold" };
const italic: TipTapMark = { type: "italic" };
const strike: TipTapMark = { type: "strike" };
const subscript: TipTapMark = { type: "subscript" };
const superscript: TipTapMark = { type: "superscript" };
const highlight: TipTapMark = { type: "inlineStyle", attrs: { type: "highlight" } };
const tag: TipTapMark = { type: "inlineStyle", attrs: { type: "tag" } };
const createLinkMark = (data: LinkInput): TipTapMark => ({ type: "link", attrs: { data } });

const nonBreakingSpace: TipTapNode = { type: "nonBreakingSpace" };
const softHyphen: TipTapNode = { type: "softHyphen" };

const createText = (value: string, marks?: TipTapMark[]): TipTapNode => ({ type: "text", text: value, ...(marks?.length ? { marks } : {}) });

const createParagraph = (content: TipTapNode[], textBlockStyle?: TextBlockStyle | ListStyle): TipTapNode => ({
    type: "paragraph",
    ...(textBlockStyle ? { attrs: { textBlockStyle } } : {}),
    content,
});

const createHeading = (level: number, content: TipTapNode[]): TipTapNode => ({ type: "heading", attrs: { level }, content });

const createListItem = (content: TipTapNode[], listStyle: ListStyle): TipTapNode => ({
    type: "listItem",
    content: [createParagraph(content, listStyle)],
});

const createBulletList = (items: TipTapNode[][], listStyle: ListStyle): TipTapNode => ({
    type: "bulletList",
    content: items.map((item) => createListItem(item, listStyle)),
});

const createOrderedList = (items: TipTapNode[][], listStyle: ListStyle): TipTapNode => ({
    type: "orderedList",
    content: items.map((item) => createListItem(item, listStyle)),
});

const createDocument = (content: TipTapNode[]): RichTextInput => ({ tipTapContent: { type: "doc", content } });

const createPageBlock = <BlockType extends string, Props>(type: BlockType, props: Props) => ({
    key: faker.string.uuid(),
    visible: true,
    type,
    props,
    userGroup: UserGroup.all,
});

const getHeadingLevel = (cellIndex: number): number => (cellIndex % HEADING_LEVEL_COUNT) + 1;

const getEyebrowStyle = (cellIndex: number): TextBlockStyle => eyebrowStyles[cellIndex % eyebrowStyles.length];

interface ContentMetrics {
    cells: number;
    paragraphs: number;
    headings: number;
    lists: number;
    listItems: number;
    textNodes: number;
    markApplications: number;
    textBlockStyles: Set<string>;
    marks: Set<string>;
}

function tallyNode(node: TipTapNode, metrics: ContentMetrics): void {
    switch (node.type) {
        case "paragraph":
            metrics.paragraphs++;
            break;
        case "heading":
            metrics.headings++;
            break;
        case "bulletList":
        case "orderedList":
            metrics.lists++;
            break;
        case "listItem":
            metrics.listItems++;
            break;
        case "text":
            metrics.textNodes++;
            break;
    }

    const textBlockStyle = node.attrs?.textBlockStyle;
    if (typeof textBlockStyle === "string") {
        metrics.textBlockStyles.add(textBlockStyle);
    }

    for (const mark of node.marks ?? []) {
        metrics.markApplications++;
        const inlineStyleType = mark.attrs?.type;
        metrics.marks.add(mark.type === "inlineStyle" && typeof inlineStyleType === "string" ? `inlineStyle:${inlineStyleType}` : mark.type);
    }

    for (const child of node.content ?? []) {
        tallyNode(child, metrics);
    }
}

function collectMetrics(cellContents: RichTextInput[]): ContentMetrics {
    const metrics: ContentMetrics = {
        cells: cellContents.length,
        paragraphs: 0,
        headings: 0,
        lists: 0,
        listItems: 0,
        textNodes: 0,
        markApplications: 0,
        textBlockStyles: new Set<string>(),
        marks: new Set<string>(),
    };

    for (const cellContent of cellContents) {
        tallyNode(cellContent.tipTapContent, metrics);
    }

    return metrics;
}

function createSummaryContent({
    cellContents,
    columnCount,
    rowCount,
}: {
    cellContents: RichTextInput[];
    columnCount: number;
    rowCount: number;
}): RichTextInput {
    const metrics = collectMetrics(cellContents);
    const sortedStyles = Array.from(metrics.textBlockStyles).sort();
    const sortedMarks = Array.from(metrics.marks).sort();

    const createMetricItem = (label: string, value: number | string): TipTapNode[] => [createText(`${label}: `, [bold]), createText(String(value))];

    return createDocument([
        createHeading(2, [createText("TipTap table readonly stress test")]),
        createParagraph(
            [
                createText("This page holds a single "),
                createText("Table (TipTap)", [bold]),
                createText(" block. Every cell renders its own readonly TipTap editor, so the admin has to mount "),
                createText(`${metrics.cells} editors`, [highlight]),
                createText(" at once."),
            ],
            "paragraph300",
        ),
        createBulletList(
            [
                createMetricItem("Columns", columnCount),
                createMetricItem("Rows (incl. header)", rowCount),
                createMetricItem("Cells / readonly editors", metrics.cells),
                createMetricItem("Paragraphs", metrics.paragraphs),
                createMetricItem("Headings", metrics.headings),
                createMetricItem("Lists", metrics.lists),
                createMetricItem("List items", metrics.listItems),
                createMetricItem("Text nodes", metrics.textNodes),
                createMetricItem("Mark applications", metrics.markApplications),
                createMetricItem("Distinct text block styles", `${metrics.textBlockStyles.size} (${sortedStyles.join(", ")})`),
                createMetricItem("Distinct marks / inline styles", `${metrics.marks.size} (${sortedMarks.join(", ")})`),
            ],
            "list300",
        ),
    ]);
}

function createHeaderCellContent(columnIndex: number): RichTextInput {
    return createDocument([createParagraph([createText(`Column ${columnIndex + 1} `, [bold]), createText("★", [highlight])], "eyebrow600")]);
}

type CreateCellContent = (cell: { index: number; link: LinkInput }) => RichTextInput;

const cellContentVariants: CreateCellContent[] = [
    ({ index }) =>
        createDocument([
            createHeading(getHeadingLevel(index), [createText(faker.commerce.productName())]),
            createParagraph(
                [
                    createText(`${faker.lorem.sentence()} `),
                    createText(faker.lorem.words(2), [bold]),
                    createText(" "),
                    createText(faker.lorem.words(2), [italic]),
                ],
                "paragraph300",
            ),
        ]),
    ({ link: currentLink }) =>
        createDocument([
            createParagraph(
                [
                    createText("bold ", [bold]),
                    createText("italic ", [italic]),
                    createText("strike ", [strike]),
                    createText("H"),
                    createText("2", [subscript]),
                    createText("O, E=mc"),
                    createText("2", [superscript]),
                    createText(" "),
                    createText("highlighted ", [highlight]),
                    createText(faker.lorem.words(2), [createLinkMark(currentLink)]),
                    createText(" "),
                    nonBreakingSpace,
                    createText("no"),
                    softHyphen,
                    createText("break"),
                ],
                "paragraph300",
            ),
        ]),
    () =>
        createDocument([
            createParagraph(
                [createText(`${faker.lorem.words(3)} `), createText("tagged", [tag]), createText(" and "), createText("highlighted", [highlight])],
                "paragraph200",
            ),
        ]),
    ({ link: currentLink }) =>
        createDocument([
            createBulletList(
                [
                    [createText(faker.lorem.words(3), [bold])],
                    [createText(faker.lorem.words(3), [italic])],
                    [createText(`${faker.lorem.words(2)} `), createText("link", [createLinkMark(currentLink)])],
                ],
                "list300",
            ),
        ]),
    () =>
        createDocument([
            createOrderedList(
                [[createText(faker.lorem.words(3))], [createText(faker.lorem.words(2), [highlight])], [createText(faker.lorem.words(3), [strike])]],
                "list200",
            ),
        ]),
    ({ index, link: currentLink }) =>
        createDocument([
            createParagraph([createText(faker.company.catchPhrase())], getEyebrowStyle(index)),
            createParagraph([createText(`${faker.lorem.sentence()} `), createText("read more", [createLinkMark(currentLink)])], "paragraph200"),
        ]),
    ({ index }) =>
        createDocument([
            createHeading(getHeadingLevel(index), [createText(faker.commerce.department())]),
            createParagraph([createText(faker.lorem.sentence())], "paragraph300"),
            createBulletList([[createText(faker.lorem.words(2))], [createText(faker.lorem.words(3), [bold])]], "list300"),
        ]),
    () =>
        createDocument([
            createParagraph(
                [
                    createText("formula a"),
                    createText("n", [subscript]),
                    createText(" + x"),
                    createText("2", [superscript]),
                    createText(" "),
                    nonBreakingSpace,
                    createText(faker.lorem.words(2), [highlight]),
                ],
                "paragraph200",
            ),
        ]),
    ({ index }) =>
        createDocument([
            createParagraph([createText(faker.lorem.sentence())], "paragraph300"),
            createParagraph([createText(faker.lorem.sentence())], "paragraph200"),
            createParagraph([createText(faker.lorem.words(3))], getEyebrowStyle(index)),
        ]),
];

function createCellContent(index: number, links: LinkInput[]): RichTextInput {
    const variant = cellContentVariants[index % cellContentVariants.length];
    return variant({ index, link: links[index % links.length] });
}

@Injectable()
export class TipTapTableStressTestPageFixtureService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly pageTreeService: PageTreeService,
        private readonly linkBlockFixtureService: LinkBlockFixtureService,
    ) {}

    async execute(): Promise<void> {
        const documentId = "a7f3c1d2-9b4e-4c2a-8e1f-2d3c4b5a6f70";
        const scope: PageTreeNodeScope = { domain: "main", language: "en" };

        const createNodeInput: PageTreeNodeCreateInput = {
            name: "Table Stresstest (TipTap)",
            slug: "table-stresstest-tiptap",
            attachedDocument: { id: documentId, type: "Page" },
            userGroup: UserGroup.all,
        };

        const node = await this.pageTreeService.createNode(createNodeInput, PageTreeNodeCategory.mainNavigation, scope);
        await this.pageTreeService.updateNodeVisibility(node.id, PageTreeNodeVisibility.Published);

        const links = await Promise.all(Array.from({ length: LINK_POOL_SIZE }, () => this.linkBlockFixtureService.generateBlockInput()));

        const columns = Array.from({ length: COLUMN_COUNT }, (_, columnIndex) => ({
            id: `column-${columnIndex}`,
            size: columnSizes[columnIndex % columnSizes.length],
            highlighted: columnIndex % 4 === 0,
        }));

        const headerRow = {
            id: faker.string.uuid(),
            highlighted: true,
            cellValues: columns.map((column, columnIndex) => ({ columnId: column.id, value: createHeaderCellContent(columnIndex) })),
        };

        const dataRows = Array.from({ length: DATA_ROW_COUNT }, (_, rowIndex) => ({
            id: faker.string.uuid(),
            highlighted: rowIndex % 5 === 0,
            cellValues: columns.map((column, columnIndex) => ({
                columnId: column.id,
                value: createCellContent(rowIndex * COLUMN_COUNT + columnIndex, links),
            })),
        }));

        const rows = [headerRow, ...dataRows];
        const cellContents = rows.flatMap((row) => row.cellValues.map((cellValue) => cellValue.value));

        const pageInput = new PageInput();
        pageInput.seo = generateSeoBlock();
        pageInput.content = PageContentBlock.blockInputFactory({
            blocks: [
                createPageBlock("tipTapRichText", createSummaryContent({ cellContents, columnCount: columns.length, rowCount: rows.length })),
                createPageBlock("tipTapTable", { columns, rows }),
            ],
        });
        pageInput.stage = StageBlock.blockInputFactory({ blocks: [] });

        await this.entityManager.persistAndFlush(
            this.entityManager.create(Page, {
                id: documentId,
                content: pageInput.content.transformToBlockData(),
                seo: pageInput.seo.transformToBlockData(),
                stage: pageInput.stage.transformToBlockData(),
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        );
    }
}
