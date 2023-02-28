import { BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/blocks-api";
import { DocumentInterface, RootBlockDataScalar, RootBlockType } from "@comet/cms-api";
import { BaseEntity, Entity, OneToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { PageTreeNode } from "@src/page-tree/entities/page-tree-node.entity";
import { v4 as uuid } from "uuid";

export const MAIN_MENU_ITEM_BLOCK_INDEX_IDENTIFIER = "MainMenuItem_BlockIndex";

@Entity()
@ObjectType()
@RootBlockEntity()
export class MainMenuItem extends BaseEntity<MainMenuItem, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @OneToOne({ joinColumn: "nodeId", onDelete: "CASCADE" })
    @Field(() => PageTreeNode)
    node: PageTreeNode;

    @Property({ customType: new RootBlockType(RichTextBlock), nullable: true })
    @RootBlock(RichTextBlock)
    @Field(() => RootBlockDataScalar(RichTextBlock), { nullable: true })
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
