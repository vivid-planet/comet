import { instanceToPlain, plainToInstance, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsString } from "class-validator";

import { Block, BlockData, BlockDataInterface, BlockInput, BlockInputInterface, blockInputToData, createBlock } from "../block";
import { BlockField } from "../decorators/field";
import { BlockFactoryNameOrOptions } from "./types";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type CreateTableBlockOptions = {
    // TODO: Allow configuring the RichText block here
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

class TableBlockRowColumnValueData extends BlockData {
    @BlockField()
    columnId: string;

    @BlockField({ type: "string" })
    value: string;
}

class TableBlockRowColumnValueInput extends BlockInput {
    @BlockField()
    @IsString()
    columnId: string;

    @BlockField({ type: "string" })
    @IsString()
    value: string;

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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TableBlockDataInterface extends BlockDataInterface {
    // TODO: Add richText block here
}

interface TableBlockInputInterface extends BlockInputInterface<BlockDataInterface, { columns: TableBlockColumnInput[]; rows: TableBlockRowInput[] }> {
    columns: TableBlockColumnInput[];
    rows: TableBlockRowInput[];
}

export function createTableBlock(
    options: CreateTableBlockOptions,
    nameOrOptions: BlockFactoryNameOrOptions = "Table",
): Block<TableBlockDataInterface, TableBlockInputInterface> {
    class TableBlockData extends BlockData {
        @BlockField(TableBlockColumnData)
        @Type(() => TableBlockColumnData)
        columns: TableBlockColumnData[] = [];

        @BlockField(TableBlockRowData)
        @Type(() => TableBlockRowData)
        rows: TableBlockRowData[] = [];
    }

    class TableBlockInput implements TableBlockInputInterface {
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

        toPlain(): ReturnType<TableBlockInputInterface["toPlain"]> {
            return instanceToPlain(this) as ReturnType<TableBlockInputInterface["toPlain"]>;
        }
    }

    return createBlock(TableBlockData, TableBlockInput, nameOrOptions);
}
