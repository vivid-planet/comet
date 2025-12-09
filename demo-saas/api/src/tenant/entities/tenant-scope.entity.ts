import { CrudField, CrudGenerator, RootBlockEntity } from "@comet/cms-api";
import { BaseEntity, Entity, ManyToOne, OptionalProps, PrimaryKey, Property, Ref } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 } from "uuid";

import { Tenant } from "./tenant.entity";

@Entity()
@ObjectType()
@RootBlockEntity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["tenantAdministration"], delete: false })
export class TenantScope extends BaseEntity {
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
    domain: string;

    @Property()
    @Field()
    language: string;

    @ManyToOne(() => Tenant, { ref: true })
    @CrudField({
        dedicatedResolverArg: true,
    })
    tenant: Ref<Tenant>;
}
