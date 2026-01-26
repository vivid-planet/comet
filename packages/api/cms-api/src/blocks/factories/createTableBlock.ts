import { instanceToPlain, plainToInstance, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsString } from "class-validator";

import {
    Block,
    BlockData,
    BlockDataFactory,
    BlockDataInterface,
    BlockInput,
    BlockInputFactory,
    BlockInputInterface,
    blockInputToData,
    registerBlock,
} from "../block";
import { AnnotationBlockMeta, BlockField } from "../decorators/field";
import { strictBlockDataFactoryDecorator } from "../helpers/strictBlockDataFactoryDecorator";
import { strictBlockInputFactoryDecorator } from "../helpers/strictBlockInputFactoryDecorator";
import { createAppliedMigrationsBlockDataFactoryDecorator } from "../migrations/createAppliedMigrationsBlockDataFactoryDecorator";
import { BlockDataMigrationVersion } from "../migrations/decorators/BlockDataMigrationVersion";
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
    const blockName = typeof nameOrOptions === "string" ? nameOrOptions : nameOrOptions.name;
    const migrate = typeof nameOrOptions !== "string" && nameOrOptions.migrate ? nameOrOptions.migrate : { migrations: [], version: 0 };

    @BlockDataMigrationVersion(migrate.version)
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

    const blockDataFactory: BlockDataFactory<TableBlockData> = (o) => plainToInstance(TableBlockData, o);
    const blockInputFactory: BlockInputFactory<TableBlockInputInterface> = (o) => plainToInstance(TableBlockInput, o);

    let decoratedBlockDataFactory = blockDataFactory;
    if (migrate.migrations) {
        const migrationsDecorator = createAppliedMigrationsBlockDataFactoryDecorator(migrate.migrations, blockName);
        decoratedBlockDataFactory = migrationsDecorator(decoratedBlockDataFactory);
    }
    decoratedBlockDataFactory = strictBlockDataFactoryDecorator(decoratedBlockDataFactory);

    const decoratedBlockInputFactory = strictBlockInputFactoryDecorator(blockInputFactory);

    const TableBlock: Block<TableBlockDataInterface, TableBlockInputInterface> = {
        name: blockName,
        blockDataFactory: decoratedBlockDataFactory,
        blockInputFactory: decoratedBlockInputFactory,
        blockMeta: new AnnotationBlockMeta(TableBlockData),
        blockInputMeta: new AnnotationBlockMeta(TableBlockInput),
    };

    registerBlock(TableBlock);
    return TableBlock;
}
