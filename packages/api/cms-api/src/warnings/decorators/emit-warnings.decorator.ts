import { type AnyEntity } from "@mikro-orm/postgresql";
import { type CustomDecorator, SetMetadata, type Type } from "@nestjs/common";

import { type BlockWarning } from "../../blocks/block";

type EmitWarningsFunction<Entity extends AnyEntity = AnyEntity> = (item: Entity) => Promise<BlockWarning[]>; // todo change block warning to a more generic warning type
export interface EmitWarningsServiceInterface<Entity extends AnyEntity = AnyEntity> {
    emitWarnings: EmitWarningsFunction<Entity>;
}

export type EmitWarningsMeta<Entity extends AnyEntity = AnyEntity> = EmitWarningsFunction<Entity> | Type<EmitWarningsServiceInterface<Entity>>;

export function EmitWarnings<Entity extends AnyEntity = AnyEntity>(value: EmitWarningsMeta<Entity>): CustomDecorator<string> {
    return SetMetadata<string, EmitWarningsMeta<Entity>>("emitWarnings", value);
}
