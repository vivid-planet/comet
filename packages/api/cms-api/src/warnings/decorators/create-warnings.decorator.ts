import { type AnyEntity } from "@mikro-orm/postgresql";
import { type CustomDecorator, SetMetadata, type Type } from "@nestjs/common";

import { type WarningData } from "../dto/warning-data";

interface BulkCreateWarningData {
    warnings: WarningData[];
    tableRowId: string;
}

export type CreateWarningsFunction<Entity extends AnyEntity = AnyEntity> = (item: Entity) => Promise<WarningData[]>;
type CreateWarningsBulkFunction = () => AsyncGenerator<BulkCreateWarningData>;

export interface CreateWarningsServiceInterface<Entity extends AnyEntity = AnyEntity> {
    /**
     * Creates warnings in bulk for all rows of an entity.
     * It is invoked by the warning-checker command, which is typically run once per day, though the frequency can be configured.
     *
     * This function is optional but strongly recommended. If not implemented,
     * the warning-checker will process each row individually, calling `createWarnings`,
     * which is generally less efficient.
     *
     * Ensure all warnings for the entity are reported, because old warnings will be deleted automatically
     */
    bulkCreateWarnings?: CreateWarningsBulkFunction;
    /**
     * Creates warnings for a specific entity
     * This function is called whenever an entity is created or updated.
     * If `bulkCreateWarnings` is not defined, it is also invoked by the warning-checker command,
     */
    createWarnings: CreateWarningsFunction<Entity>;
}

export type CreateWarningsMeta<Entity extends AnyEntity = AnyEntity> = CreateWarningsFunction<Entity> | Type<CreateWarningsServiceInterface<Entity>>;

export function CreateWarnings<Entity extends AnyEntity = AnyEntity>(value: CreateWarningsMeta<Entity>): CustomDecorator<string> {
    return SetMetadata<string, CreateWarningsMeta<Entity>>("createWarnings", value);
}
