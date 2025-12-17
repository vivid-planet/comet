import { CrudField, CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Collection, Entity, OneToMany, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Department } from "@src/department/entities/department.entity";
import { v4 } from "uuid";

import { TenantUser } from "./tenant-user.entity";

@Entity()
@ObjectType()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["tenantAdministration"], delete: false })
export class Tenant extends BaseEntity {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();

    @Property({ type: "text" })
    @Field()
    name: string;

    @OneToMany(() => Department, (department) => department.tenant, { orphanRemoval: true })
    @CrudField({
        input: false,
    })
    departments = new Collection<Department>(this);

    @OneToMany(() => TenantUser, (user) => user.tenant, { orphanRemoval: true })
    @CrudField({
        input: false,
        resolveField: false,
        filter: false,
        sort: false,
        search: false,
    })
    users = new Collection<TenantUser>(this);
}
