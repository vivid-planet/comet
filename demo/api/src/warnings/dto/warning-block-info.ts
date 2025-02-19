import { Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
@InputType("WarningBlockInfoInput")
export class WarningBlockInfo {
    @Property()
    @Field()
    rootEntityName: string;

    @Property()
    @Field()
    rootColumnName: string;

    @Property()
    @Field()
    rootPrimaryKey: string;

    @Property()
    @Field()
    targetId: string;
}
