import {
    BlockDataInterface,
    DocumentInterface,
    PageTreeNodeDocumentEntityScopeService,
    RootBlockDataScalar,
    RootBlockType,
    ScopedEntity,
} from "@comet/cms-api";
import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { LinkBlock } from "@src/common/blocks/link.block";
import { v4 } from "uuid";

@Entity()
@ObjectType({
    implements: () => [DocumentInterface],
})
@ScopedEntity(PageTreeNodeDocumentEntityScopeService)
export class Link extends BaseEntity implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @Property({ type: new RootBlockType(LinkBlock) })
    @Field(() => RootBlockDataScalar(LinkBlock))
    content: BlockDataInterface;

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
