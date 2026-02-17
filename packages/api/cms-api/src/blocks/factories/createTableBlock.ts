import { Expose, plainToInstance, Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsString, ValidateNested } from "class-validator";

import {
    Block,
    BlockData,
    BlockDataInterface,
    BlockInput,
    BlockInputInterface,
    blockInputToData,
    createBlock,
    ExtractBlockData,
    ExtractBlockInput,
    isBlockDataInterface,
    isBlockInputInterface,
} from "../block";
import { BlockField } from "../decorators/field";
import { BlockFactoryNameOrOptions } from "./types";

type CreateTableBlockOptions<CellContentBlock extends Block> = {
    cellContent: CellContentBlock;
};

enum ColumnSize {
    extraSmall = "extraSmall",
    small = "small",
    standard = "standard",
    large = "large",
    extraLarge = "extraLarge",
}

class TableBlockColumnData extends BlockData {
    @BlockField()
    id: string;

    @BlockField({ type: "enum", enum: ColumnSize })
    size: ColumnSize;

    @BlockField()
    highlighted: boolean;
}

class TableBlockColumnInput extends BlockInput {
    @BlockField()
    @IsString()
    id: string;

    @BlockField({ type: "enum", enum: ColumnSize })
    @IsEnum(ColumnSize)
    size: ColumnSize;

    @BlockField()
    @IsBoolean()
    highlighted: boolean;

    transformToBlockData(): TableBlockColumnData {
        return blockInputToData(TableBlockColumnData, this);
    }
}

interface TableBlockCellValueDataInterface<CellContentData extends BlockDataInterface> {
    columnId: string;
    value: CellContentData;
}

interface TableBlockCellValueInputInterface<CellContentInput extends BlockInputInterface> {
    columnId: string;
    value: CellContentInput;
}

interface TableBlockRowDataInterface<CellContentData extends BlockDataInterface> {
    id: string;
    highlighted: boolean;
    cellValues: TableBlockCellValueDataInterface<CellContentData>[];
}

interface TableBlockRowInputInterface<CellContentInput extends BlockInputInterface> {
    id: string;
    highlighted: boolean;
    cellValues: TableBlockCellValueInputInterface<CellContentInput>[];
}

interface TableBlockDataInterface<CellContentData extends BlockDataInterface> extends BlockDataInterface {
    columns: TableBlockColumnData[];
    rows: TableBlockRowDataInterface<CellContentData>[];
}

interface TableBlockInputInterface<CellContentInput extends BlockInputInterface>
    extends BlockInputInterface<BlockDataInterface, { columns: TableBlockColumnInput[]; rows: TableBlockRowInputInterface<CellContentInput>[] }> {
    columns: TableBlockColumnInput[];
    rows: TableBlockRowInputInterface<CellContentInput>[];
}

export function createTableBlock<CellContentBlock extends Block>(
    options: CreateTableBlockOptions<CellContentBlock>,
    nameOrOptions: BlockFactoryNameOrOptions = "Table",
): Block<TableBlockDataInterface<ExtractBlockData<CellContentBlock>>, TableBlockInputInterface<ExtractBlockInput<CellContentBlock>>> {
    const { cellContent: CellContentBlock } = options;

    class TableBlockRowColumnValueData extends BlockData {
        @BlockField()
        columnId: string;

        @BlockField({ type: "block", block: CellContentBlock })
        @Transform(
            ({ value }) => {
                if (isBlockDataInterface(value)) {
                    return value;
                }
                return CellContentBlock.blockDataFactory(value);
            },
            { toClassOnly: true },
        )
        value: BlockDataInterface;
    }

    class TableBlockRowColumnValueInput extends BlockInput {
        @BlockField()
        @IsString()
        columnId: string;

        @ValidateNested()
        @BlockField({ type: "block", block: CellContentBlock })
        @Expose()
        @Transform(
            ({ value }) => {
                if (isBlockInputInterface(value)) {
                    return value;
                }
                return CellContentBlock.blockInputFactory(value);
            },
            { toClassOnly: true },
        )
        value: ExtractBlockInput<CellContentBlock>;

        transformToBlockData(): TableBlockRowColumnValueData {
            return blockInputToData(TableBlockRowColumnValueData, this);
        }
    }

    class TableBlockRowData extends BlockData {
        @BlockField()
        id: string;

        @BlockField()
        highlighted: boolean;

        @BlockField(TableBlockRowColumnValueData)
        @Type(() => TableBlockRowColumnValueData)
        cellValues: TableBlockRowColumnValueData[] = [];
    }

    class TableBlockRowInput extends BlockInput {
        @BlockField()
        @IsString()
        id: string;

        @BlockField()
        @IsBoolean()
        highlighted: boolean;

        @BlockField(TableBlockRowColumnValueInput)
        @Type(() => TableBlockRowColumnValueInput)
        cellValues: TableBlockRowColumnValueInput[] = [];

        transformToBlockData(): TableBlockRowData {
            return blockInputToData(TableBlockRowData, this);
        }
    }

    class TableBlockData extends BlockData {
        @BlockField(TableBlockColumnData)
        @Type(() => TableBlockColumnData)
        columns: TableBlockColumnData[] = [];

        @BlockField(TableBlockRowData)
        @Type(() => TableBlockRowData)
        rows: TableBlockRowData[] = [];
    }

    class TableBlockInput extends BlockInput {
        @BlockField(TableBlockColumnInput)
        @IsArray()
        @Type(() => TableBlockColumnInput)
        columns: TableBlockColumnInput[] = [];

        @BlockField(TableBlockRowInput)
        @IsArray()
        @Type(() => TableBlockRowInput)
        rows: TableBlockRowInput[] = [];

        transformToBlockData(): TableBlockData {
            return plainToInstance(TableBlockData, {
                ...this,
                columns: this.columns.map((column) => column.transformToBlockData()),
                rows: this.rows.map((row) => row.transformToBlockData()),
            });
        }
    }

    return createBlock(TableBlockData, TableBlockInput, nameOrOptions) as unknown as Block<
        TableBlockDataInterface<ExtractBlockData<CellContentBlock>>,
        TableBlockInputInterface<ExtractBlockInput<CellContentBlock>>
    >;
}
