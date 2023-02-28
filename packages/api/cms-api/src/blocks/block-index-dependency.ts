import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BlockIndexDependency {
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
    targetEntityName: string;

    @Field()
    targetGraphqlObjectType: string;

    targetTableName: string;

    targetPrimaryKey: string;

    @Field()
    targetId: string;
}
