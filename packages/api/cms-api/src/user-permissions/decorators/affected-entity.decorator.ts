import { type EntityClass, type EntityName } from "@mikro-orm/postgresql";

export interface AffectedEntityOptions {
    idArg?: string;
    pageTreeNodeIdArg?: string;
    nullable?: boolean;
}
export type AffectedEntityMeta = {
    entity: EntityClass<object>;
    options: AffectedEntityOptions;
};

export const AffectedEntity = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entity: EntityName<any>,
    { idArg, pageTreeNodeIdArg, nullable }: AffectedEntityOptions = { idArg: "id" },
): MethodDecorator => {
    return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
        const metadata = Reflect.getOwnMetadata("affectedEntities", descriptor.value) || [];
        metadata.push({ entity, options: { idArg, pageTreeNodeIdArg, nullable } });
        Reflect.defineMetadata("affectedEntities", metadata, descriptor.value);
        return descriptor;
    };
};
