import { CrudField, CrudGenerator } from "@comet/cms-api";
import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property, Ref, Unique } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 } from "uuid";

import { Tenant } from "./tenant.entity";

@Entity()
@ObjectType()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["tenantAdministration"], update: false, create: false })
@Unique({ properties: ["tenant", "userId"] })
export class TenantUser extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @ManyToOne(() => Tenant, { ref: true })
    @CrudField({
        dedicatedResolverArg: true,
    })
    tenant: Ref<Tenant>;

    @Property({ type: "text" })
    @Field(() => String)
    userId: string;
}
