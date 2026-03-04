import {
    BlockDataInterface,
    CrudSingleGenerator,
    DocumentInterface,
    RootBlock,
    RootBlockDataScalar,
    RootBlockEntity,
    RootBlockType,
} from "@comet/cms-api";
import { BaseEntity, Embedded, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { NavigationCallToActionButtonListContentBlock } from "@src/navigation-call-to-action-button-lists/blocks/navigation-call-to-action-button-list-content.block";
import { NavigationCallToActionButtonListScope } from "@src/navigation-call-to-action-button-lists/dto/navigation-call-to-action-button-list-scope";
import { v4 } from "uuid";

@Entity()
@ObjectType({
    implements: () => [DocumentInterface],
})
@RootBlockEntity()
@CrudSingleGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: "pageTree" })
export class NavigationCallToActionButtonList extends BaseEntity implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @RootBlock(NavigationCallToActionButtonListContentBlock)
    @Property({ type: new RootBlockType(NavigationCallToActionButtonListContentBlock) })
    @Field(() => RootBlockDataScalar(NavigationCallToActionButtonListContentBlock))
    content: BlockDataInterface;

    @Embedded(() => NavigationCallToActionButtonListScope)
    @Field(() => NavigationCallToActionButtonListScope)
    scope: NavigationCallToActionButtonListScope;

    @Property()
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
