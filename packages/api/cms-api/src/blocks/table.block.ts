import { BlockData, BlockField, BlockInput, createBlock, inputToData } from "@comet/blocks-api";
import { plainToInstance, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsString } from "class-validator";

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

    @BlockField()
    position: number;

    @BlockField({ type: "enum", enum: ColumnSize })
    size: ColumnSize;

    @BlockField()
    highlighted: boolean;
}

class TableBlockColumnInput extends BlockInput {
    @BlockField()
    @IsString()
    id: string;

    @BlockField()
    @IsNumber()
    position: number;

    @BlockField({ type: "enum", enum: ColumnSize })
    @IsEnum(ColumnSize)
    size: ColumnSize;

    @BlockField()
    @IsBoolean()
    highlighted: boolean;

    transformToBlockData(): TableBlockColumnData {
        return inputToData(TableBlockColumnData, this);
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
        return inputToData(TableBlockRowColumnValueData, this);
    }
}

class TableBlockRowData extends BlockData {
    @BlockField()
    id: string;

    @BlockField()
    position: number;

    @BlockField()
    highlighted: boolean;

    @BlockField(TableBlockRowColumnValueData)
    @Type(() => TableBlockRowColumnValueData)
    columnValues: TableBlockRowColumnValueData[] = [];
}

class TableBlockRowInput extends BlockInput {
    @BlockField()
    @IsString()
    id: string;

    @BlockField()
    @IsNumber()
    position: number;

    @BlockField()
    @IsBoolean()
    highlighted: boolean;

    @BlockField(TableBlockRowColumnValueInput)
    @Type(() => TableBlockRowColumnValueInput)
    columnValues: TableBlockRowColumnValueInput[] = [];

    transformToBlockData(): TableBlockRowData {
        return inputToData(TableBlockRowData, this);
    }
}

export class TableBlockData extends BlockData {
    @BlockField(TableBlockColumnData)
    @Type(() => TableBlockColumnData)
    columns: TableBlockColumnData[] = [];

    @BlockField(TableBlockRowData)
    @Type(() => TableBlockRowData)
    rows: TableBlockRowData[] = [];
}

export class TableBlockInput extends BlockInput {
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

export const TableBlock = createBlock(TableBlockData, TableBlockInput, "Table");
