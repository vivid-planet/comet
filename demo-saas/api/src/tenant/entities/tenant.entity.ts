import { CrudField, CrudGenerator, RootBlockEntity } from "@comet/cms-api";
import { BaseEntity, Collection, Entity, OneToMany, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Department } from "@src/department/entities/department.entity";
import { v4 } from "uuid";

@Entity()
@ObjectType()
@RootBlockEntity()
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
}
