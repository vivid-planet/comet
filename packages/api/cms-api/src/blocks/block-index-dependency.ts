import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BlockIndexDependency {
    @Field()
    rootIdentifier: string;

    @Field(() => String)
    rootId: string;

    @Field()
    rootEntityName: string;

    @Field()
    rootGraphqlObjectType: string;

    @Field()
    rootTableName: string;

    @Field()
    rootColumnName: string;

    @Field()
    rootPrimaryKey: string;

    @Field()
    blockname: string;

    @Field()
    jsonPath: string;

    @Field(() => Boolean)
    visible: boolean;

    @Field()
    targetIdentifier: string;

    @Field()
    targetEntityName: string;

    @Field()
    targetGraphqlObjectType: string;

    @Field()
    targetTableName: string;

    @Field()
    targetPrimaryKey: string;

    @Field()
    targetId: string;
}
