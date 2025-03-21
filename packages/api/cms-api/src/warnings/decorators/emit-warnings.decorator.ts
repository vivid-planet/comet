import { type AnyEntity } from "@mikro-orm/postgresql";
import { type CustomDecorator, SetMetadata, type Type } from "@nestjs/common";

import { type WarningInput } from "../dto/warning.input";

type EmitWarningsFunction<Entity extends AnyEntity = AnyEntity> = (item: Entity) => Promise<WarningInput[]>;
type EmitWarningsBulkFunction = () => Promise<WarningInput[]>;

export interface EmitWarningsServiceInterface<Entity extends AnyEntity = AnyEntity> {
    emitWarningsBulk?: EmitWarningsBulkFunction;
    emitWarnings: EmitWarningsFunction<Entity>;
}

export type EmitWarningsMeta<Entity extends AnyEntity = AnyEntity> = EmitWarningsFunction<Entity> | Type<EmitWarningsServiceInterface<Entity>>;

export function EmitWarnings<Entity extends AnyEntity = AnyEntity>(value: EmitWarningsMeta<Entity>): CustomDecorator<string> {
    return SetMetadata<string, EmitWarningsMeta<Entity>>("emitWarnings", value);
}
