import { CrudGenerator, RootBlockEntity } from "@comet/cms-api";
import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 } from "uuid";

@Entity()
@ObjectType()
@RootBlockEntity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["tenantAdministration"] })
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

    @Property()
    @Field()
    name: string;
}
