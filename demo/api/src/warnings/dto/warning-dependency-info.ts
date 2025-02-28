import { Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
@InputType("WarningDependencyInfoInput")
export class WarningDependencyInfo {
    @Property()
    @Field()
    rootEntityName: string;

    @Property({ nullable: true })
    @Field({ nullable: true })
    rootColumnName?: string;

    @Property({ nullable: true })
    @Field({ nullable: true })
    rootPrimaryKey?: string;

    @Property()
    @Field()
    targetId: string;

    @Property({ nullable: true })
    @Field({ nullable: true })
    jsonPath?: string;
}
