import { BlockDataInterface, CrudSingleGenerator, RootBlock, RootBlockDataScalar, RootBlockEntity, RootBlockType } from "@comet/cms-api";
import { BaseEntity, Embedded, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { SiteSettingsContentBlock } from "../blocks/site-settings-content.block";
import { SiteSettingsScope } from "../dto/site-settings-scope";

@Entity()
@ObjectType()
@RootBlockEntity()
@CrudSingleGenerator({ requiredPermission: ["pageTree"] })
export class SiteSettings extends BaseEntity {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @RootBlock(SiteSettingsContentBlock)
    @Property({ type: new RootBlockType(SiteSettingsContentBlock) })
    @Field(() => RootBlockDataScalar(SiteSettingsContentBlock))
    content: BlockDataInterface;

    @Embedded(() => SiteSettingsScope)
    @Field(() => SiteSettingsScope)
    scope: SiteSettingsScope;

    @Property({ columnType: "timestamp with time zone" })
    @Field()
    createdAt: Date = new Date();

    @Property({ columnType: "timestamp with time zone", onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
