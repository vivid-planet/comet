import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BlockIndexDependency {
    @Field()
    rootIdentifier: string;

    @Field(() => String, { nullable: true })
    rootId: string | null;

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

    @Field(() => String, { nullable: true })
    targetId: string | null;
}
