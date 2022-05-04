import { PageTreeNodeBase } from "@comet/api-cms";
import { Embedded, Entity, Enum, Index, ManyToOne } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";

import { PageTreeNodeScope } from "../dto/page-tree-node-scope";
import { PageTreeNodeCategory } from "../page-tree-node-category";

@Entity({ tableName: PageTreeNodeBase.tableName })
@ObjectType("PageTreeNode") // name MUST NOT be changed in the app or gql-api in api-cms breaks
// @TODO: disguise @ObjectType("PageTreeNode") decorator under a custom decorator: f.i. @PageTreeNode
export class PageTreeNode extends PageTreeNodeBase {
    @Embedded(() => PageTreeNodeScope)
    @Field(() => PageTreeNodeScope)
    scope: PageTreeNodeScope;

    // must be overwritten too because PageTreeNode is different from BasePageTreeNode
    @ManyToOne(() => PageTreeNode, { nullable: true, joinColumn: "parentId" })
    @Index()
    parent?: PageTreeNode;

    @Enum({ items: () => PageTreeNodeCategory, default: PageTreeNodeCategory.MainNavigation })
    @Field(() => PageTreeNodeCategory)
    category: PageTreeNodeCategory;
}
