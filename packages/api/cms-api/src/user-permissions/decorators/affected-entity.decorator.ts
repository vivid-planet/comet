import { EntityClass, EntityName } from "@mikro-orm/core";

export interface AffectedEntityOptions {
    idArg?: string;
    pageTreeNodeIdArg?: string;
}
export type AffectedEntityMeta = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entity: EntityClass<object>;
    options: AffectedEntityOptions;
};

export const AffectedEntity = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entity: EntityName<any>,
    { idArg, pageTreeNodeIdArg }: AffectedEntityOptions = { idArg: "id" },
): MethodDecorator => {
    return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
        const metadata = Reflect.getOwnMetadata("affectedEntities", descriptor.value) || [];
        metadata.push({ entity, options: { idArg, pageTreeNodeIdArg } });
        Reflect.defineMetadata("affectedEntities", metadata, descriptor.value);
        return descriptor;
    };
};
