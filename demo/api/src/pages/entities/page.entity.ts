import {
    BlockDataInterface,
    DocumentInterface,
    EntityInfo,
    PageTreeNodeDocumentEntityInfoService,
    PageTreeNodeDocumentEntityScopeService,
    RootBlock,
    RootBlockDataScalar,
    RootBlockEntity,
    RootBlockType,
    ScopedEntity,
} from "@comet/cms-api";
import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { PageContentBlock } from "../blocks/page-content.block";
import { SeoBlock } from "../blocks/seo.block";

@EntityInfo(PageTreeNodeDocumentEntityInfoService)
@Entity()
@ObjectType({
    implements: () => [DocumentInterface],
})
@RootBlockEntity()
@ScopedEntity(PageTreeNodeDocumentEntityScopeService)
export class Page extends BaseEntity implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @RootBlock(PageContentBlock)
    @Property({ type: new RootBlockType(PageContentBlock) })
    @Field(() => RootBlockDataScalar(PageContentBlock))
    content: BlockDataInterface;

    @RootBlock(SeoBlock)
    @Property({ type: new RootBlockType(SeoBlock) })
    @Field(() => RootBlockDataScalar(SeoBlock))
    seo: BlockDataInterface;

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
