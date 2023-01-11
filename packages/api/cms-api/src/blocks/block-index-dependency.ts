import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BlockIndexDependency {
    @Field()
    rootIdentifier: string;

    @Field()
    id: string;

    @Field()
    entityName: string;

    @Field()
    graphqlObjectType: string;

    tableName: string;

    columnName: string;

    primaryKey: string;

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

    targetTableName: string;

    targetPrimaryKey: string;

    @Field()
    targetId: string;
}
