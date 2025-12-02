import { CrudGenerator, RootBlockEntity } from "@comet/cms-api";
import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

@RootBlockEntity()
@ObjectType()
@Entity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["tenants"] })
export class Tenant extends BaseEntity {
    [OptionalProps]?: "createdAt" | "updatedAt" | "status";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property()
    @Field()
    name: string;
}
