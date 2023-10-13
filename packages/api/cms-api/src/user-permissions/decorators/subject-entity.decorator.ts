import { EntityName } from "@mikro-orm/core";
import { CustomDecorator, SetMetadata } from "@nestjs/common";

export interface SubjectEntityOptions {
    idArg?: string;
    pageTreeNodeIdArg?: string;
}
export interface SubjectEntityMeta {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entity: EntityName<any>; //TODO
    options: SubjectEntityOptions;
}

export const SubjectEntity = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entity: EntityName<any>,
    { idArg, pageTreeNodeIdArg }: SubjectEntityOptions = { idArg: "id" },
): CustomDecorator<string> => {
    return SetMetadata("subjectEntity", { entity, options: { idArg, pageTreeNodeIdArg } });
};
