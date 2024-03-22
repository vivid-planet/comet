import { BlockDataInterface } from "@comet/blocks-api";
import {
    DocumentInterface,
    EntityInfo,
    PageTreeNodeDocumentEntityInfoService,
    PageTreeNodeDocumentEntityScopeService,
    RootBlockDataScalar,
    RootBlockType,
    ScopedEntity,
} from "@comet/cms-api";
import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { LinkBlock } from "@src/common/blocks/linkBlock/link.block";
import { v4 as uuid } from "uuid";

@EntityInfo(PageTreeNodeDocumentEntityInfoService)
@Entity()
@ObjectType({
    implements: () => [DocumentInterface],
})
@ScopedEntity(PageTreeNodeDocumentEntityScopeService)
export class Link extends BaseEntity<Link, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @Property({ customType: new RootBlockType(LinkBlock) })
    @Field(() => RootBlockDataScalar(LinkBlock))
    content: BlockDataInterface;

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
