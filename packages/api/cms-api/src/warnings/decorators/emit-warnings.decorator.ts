import { type AnyEntity } from "@mikro-orm/postgresql";
import { type CustomDecorator, SetMetadata, type Type } from "@nestjs/common";

import { type WarningInput } from "../dto/warning.input";

interface WarningBulkCreationInput {
    warnings: WarningInput[];
    tableRowId: string;
}

type EmitWarningsFunction<Entity extends AnyEntity = AnyEntity> = (item: Entity) => Promise<WarningInput[]>;
type EmitWarningsBulkFunction = () => AsyncGenerator<WarningBulkCreationInput>;

export interface EmitWarningsServiceInterface<Entity extends AnyEntity = AnyEntity> {
    /**
     * Emits warnings in bulk for all rows of an entity.
     * It is invoked by the warning-checker command, which is typically run once per day, though the frequency can be configured.
     *
     * This function is optional but strongly recommended. If not implemented,
     * the warning-checker will process each row individually, calling `emitWarnings`,
     * which is generally less efficient.
     *
     * Ensure all warnings for the entity are reported, because old warnings will be deleted automatically
     */
    emitWarningsBulk?: EmitWarningsBulkFunction;
    /**
     * Emits warnings for a specific entity
     * This function is called whenever an entity is created or updated.
     * If `emitWarningsBulk` is not defined, it is also invoked by the warning-checker command,
     */
    emitWarnings: EmitWarningsFunction<Entity>;
}

export type EmitWarningsMeta<Entity extends AnyEntity = AnyEntity> = EmitWarningsFunction<Entity> | Type<EmitWarningsServiceInterface<Entity>>;

export function EmitWarnings<Entity extends AnyEntity = AnyEntity>(value: EmitWarningsMeta<Entity>): CustomDecorator<string> {
    return SetMetadata<string, EmitWarningsMeta<Entity>>("emitWarnings", value);
}
