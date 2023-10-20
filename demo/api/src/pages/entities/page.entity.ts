import { BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/blocks-api";
import { DocumentInterface, RootBlockDataScalar, RootBlockType } from "@comet/cms-api";
import { EntityInfo } from "@comet/cms-api/lib/dam/files/decorators/entity-info.decorator";
import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { PageContentBlock } from "../blocks/PageContentBlock";
import { SeoBlock } from "../blocks/seo.block";
import { PagesEntityInfoService } from "../pages-entity-info.service";

@EntityInfo(PagesEntityInfoService)
@Entity()
@ObjectType({
    implements: () => [DocumentInterface],
})
@RootBlockEntity()
export class Page extends BaseEntity<Page, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ columnType: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @RootBlock(PageContentBlock)
    @Property({ customType: new RootBlockType(PageContentBlock) })
    @Field(() => RootBlockDataScalar(PageContentBlock))
    content: BlockDataInterface;

    @Property({ customType: new RootBlockType(SeoBlock) })
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
