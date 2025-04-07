import { BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/blocks-api";
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
import { v4 } from "uuid";

import { PageContentBlock } from "../blocks/page-content.block";
import { SeoBlock } from "../blocks/seo.block";
import { StageBlock } from "../blocks/stage.block";

@EntityInfo(PageTreeNodeDocumentEntityInfoService)
@Entity()
@ObjectType({
    implements: () => [DocumentInterface],
})
@RootBlockEntity()
@ScopedEntity(PageTreeNodeDocumentEntityScopeService)
export class Page extends BaseEntity<Page, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @RootBlock(PageContentBlock)
    @Property({ customType: new RootBlockType(PageContentBlock) })
    @Field(() => RootBlockDataScalar(PageContentBlock))
    content: BlockDataInterface;

    @RootBlock(SeoBlock)
    @Property({ customType: new RootBlockType(SeoBlock) })
    @Field(() => RootBlockDataScalar(SeoBlock))
    seo: BlockDataInterface;

    @RootBlock(StageBlock)
    @Property({ customType: new RootBlockType(StageBlock) })
    @Field(() => RootBlockDataScalar(StageBlock))
    stage: BlockDataInterface;

    @Property({
        type: "timestamp with time zone",
    })
    @Field()
    createdAt: Date = new Date();

    @Property({
        type: "timestamp with time zone",
        onUpdate: () => new Date(),
    })
    @Field()
    updatedAt: Date = new Date();
}
