import { EntityName } from "@mikro-orm/core";
import { CustomDecorator, SetMetadata } from "@nestjs/common";

export interface AffectedEntityOptions {
    idArg?: string;
    pageTreeNodeIdArg?: string;
}
export interface AffectedEntityMeta {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entity: EntityName<any>; //TODO
    options: AffectedEntityOptions;
}

export const AffectedEntity = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entity: EntityName<any>,
    { idArg, pageTreeNodeIdArg }: AffectedEntityOptions = { idArg: "id" },
): CustomDecorator<string> => {
    return SetMetadata("affectedEntity", { entity, options: { idArg, pageTreeNodeIdArg } });
};
