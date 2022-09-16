import { CustomDecorator, SetMetadata } from "@nestjs/common";

export interface SubjectEntityOptions {
    idArg?: string;
    pageTreeNodeIdArg?: string;
}
export interface SubjectEntityMeta {
    entity: any; //TODO
    options: SubjectEntityOptions;
}
export const SubjectEntity = (entity: any, { idArg, pageTreeNodeIdArg }: SubjectEntityOptions = { idArg: "id" }): CustomDecorator<string> => {
    return SetMetadata("subjectEntity", { entity, options: { idArg, pageTreeNodeIdArg } });
};
