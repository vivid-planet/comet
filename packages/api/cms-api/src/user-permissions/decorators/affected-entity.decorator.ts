import { EntityClass } from "@mikro-orm/core";
import { CustomDecorator, SetMetadata } from "@nestjs/common";

type AffectedEntityOptions = {
    argsSelector?: string;
    pageTreeNodeArgsSelector?: string;
};

export type AffectedEntity<Entity extends object = object> = {
    entity: EntityClass<Entity>;
    options?: AffectedEntityOptions;
};

export const AffectedEntity = <Entity extends object>(entity: EntityClass<Entity>, options?: AffectedEntityOptions): CustomDecorator<string> => {
    return SetMetadata<string, AffectedEntity<Entity>>("affectedEntity", { entity, options });
};
