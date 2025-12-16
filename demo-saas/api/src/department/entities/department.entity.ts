import { CrudField, CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Entity, ManyToOne, OptionalProps, PrimaryKey, Property, Ref } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Tenant } from "@src/tenant/entities/tenant.entity";
import { v4 } from "uuid";

@Entity()
@ObjectType()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["tenantAdministration"], delete: false })
export class Department extends BaseEntity {
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

    @Property()
    @Field()
    name: string;

    @ManyToOne(() => Tenant, { ref: true })
    @CrudField({
        dedicatedResolverArg: true,
    })
    tenant: Ref<Tenant>;
}
