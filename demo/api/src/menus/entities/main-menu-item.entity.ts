import { BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/api-blocks";
import { DocumentInterface, RootBlockType } from "@comet/api-cms";
import { BaseEntity, Entity, OneToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { PageTreeNode } from "@src/page-tree/entities/page-tree-node.entity";
import { GraphQLJSONObject } from "graphql-type-json";
import { v4 } from "uuid";

@Entity()
@ObjectType()
@RootBlockEntity()
export class MainMenuItem extends BaseEntity<MainMenuItem, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @OneToOne({ joinColumn: "nodeId", onDelete: "CASCADE" })
    @Field(() => PageTreeNode)
    node: PageTreeNode;

    @Property({ customType: new RootBlockType(RichTextBlock), nullable: true })
    @RootBlock(RichTextBlock)
    @Field(() => GraphQLJSONObject, { nullable: true })
    content: BlockDataInterface | null;

    @Property({
        columnType: "timestamp with time zone",
    })
    @Field()
    createdAt: Date = new Date();

    @Property({
        columnType: "timestamp with time zone",
        onUpdate: () => new Date(),
    })
    @Field()
    updatedAt: Date = new Date();
}
