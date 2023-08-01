import { BaseEntity, Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { PageTreeNodeCategory, PageTreeNodeVisibility } from "../types";

@Entity({ abstract: true })
@ObjectType("PageTreeNodeBase", { isAbstract: true }) // ObjectType must be defined in base class! (The name "PageTreeNodeBase" is not used (we have no concrete type of PageTreeNodeBase))
export abstract class PageTreeNodeBase extends BaseEntity<PageTreeNodeBase, "id"> {
    static tableName = "PageTreeNode";
    [OptionalProps]?: "createdAt" | "updatedAt" | "hideInMenu";

    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property({ columnType: "uuid", nullable: true })
    @Field(() => String, { nullable: true })
    parentId: string | null;

    // not possible in lib

    // @ManyToOne(() => PageTreeNode)
    // @Index()
    // parent?: PageTreeNode;

    @Property()
    @Field(() => Int)
    pos: number;

    @Property({ columnType: "text" })
    @Field()
    name: string;

    @Property({ columnType: "text" })
    @Field()
    slug: string;

    @Enum({ items: () => PageTreeNodeVisibility, default: PageTreeNodeVisibility.Unpublished })
    @Field(() => PageTreeNodeVisibility)
    visibility: PageTreeNodeVisibility;

    @Property({ columnType: "text" })
    @Field()
    documentType: string; // a stricter type is not possible, since this can be extended inside the application

    // @Column({ type: "json" })
    // scope?: Record<string, unknown>;

    @Property({ default: false })
    @Field()
    hideInMenu: boolean;

    category: PageTreeNodeCategory;

    @Property({
        columnType: "timestamp with time zone",
        onUpdate: () => new Date(),
    })
    @Field()
    updatedAt: Date = new Date();
}
