import {
    BlockDataInterface,
    CrudSingleGenerator,
    DamImageBlock,
    RootBlock,
    RootBlockDataScalar,
    RootBlockEntity,
    RootBlockType,
} from "@comet/cms-api";
import { ArrayType, BaseEntity, Embedded, Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsUrl } from "class-validator";
import { v4 as uuid } from "uuid";

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

    @Property({ columnType: "text" })
    @Field()
    organizationName: string;

    @Property({ columnType: "text", nullable: true })
    @Field({ nullable: true })
    @IsUrl()
    organizationUrl?: string;

    @RootBlock(DamImageBlock)
    @Property({ type: new RootBlockType(DamImageBlock) })
    @Field(() => RootBlockDataScalar(DamImageBlock))
    organizationLogo: BlockDataInterface;

    @Property({ type: ArrayType })
    @Field(() => [String])
    @IsUrl({}, { each: true })
    organizationSameAs: string[] = [];

    @Property({ columnType: "text", nullable: true })
    @Field({ nullable: true })
    organizationDescription?: string;

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
