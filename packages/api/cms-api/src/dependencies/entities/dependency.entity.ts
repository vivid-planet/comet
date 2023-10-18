import { Field, ObjectType } from "@nestjs/graphql";

// Dependency is not an actual entity because it represents a view
// and view entites are not supported yet https://github.com/mikro-orm/mikro-orm/issues/672#issuecomment-660877928
@ObjectType()
export class DependencyEntity {
    @Field()
    rootId: string;

    rootEntityName: string;

    rootTableName: string;

    rootPrimaryKey: string;

    @Field()
    rootGraphqlObjectType: string;

    @Field()
    rootColumnName: string;

    blockname: string;

    @Field()
    jsonPath: string;

    @Field(() => Boolean)
    visible: boolean;

    targetEntityName: string;

    @Field()
    targetGraphqlObjectType: string;

    targetTableName: string;

    targetPrimaryKey: string;

    @Field()
    targetId: string;
}
