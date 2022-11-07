/* eslint-disable @typescript-eslint/ban-types */
import { EntityName, Loaded } from "@mikro-orm/core";
import { SqlEntityRepository } from "@mikro-orm/postgresql";
import { CustomDecorator, SetMetadata } from "@nestjs/common";

export interface SubjectEntityOptions<Entity extends {}> {
    idArg?: string;
    pageTreeNodeIdArg?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entityByArgs?: (repo: SqlEntityRepository<Entity>, args: any) => Promise<Loaded<Entity, never>>;
}
export interface SubjectEntityMeta<Entity extends {}> {
    entity: EntityName<Entity>;
    options: SubjectEntityOptions<Entity>;
}

export const SubjectEntity = <Entity extends {}>(
    entity: EntityName<Entity>,
    { idArg, pageTreeNodeIdArg, entityByArgs }: SubjectEntityOptions<Entity> = { idArg: "id" },
): CustomDecorator<string> => {
    return SetMetadata("subjectEntity", { entity, options: { idArg, pageTreeNodeIdArg, entityByArgs } });
};
