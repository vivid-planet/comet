import { BlockDataInterface, RootBlockEntity } from "@comet/blocks-api";
import { CrudGenerator, DamImageBlock, DocumentInterface, RootBlockType } from "@comet/cms-api";
import { BaseEntity, Embeddable, Embedded, Entity, Enum, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import { v4 } from "uuid";

import { NewsContentBlock } from "../blocks/news-content.block";

export enum NewsCategory {
    Events = "Events",
    Company = "Company",
    Awards = "Awards",
}
registerEnumType(NewsCategory, {
    name: "NewsCategory",
});

@Embeddable()
@ObjectType("")
@InputType("NewsContentScopeInput")
export class NewsContentScope {
    @Property({ columnType: "text" })
    @Field()
    @IsString()
    domain: string;

    @Property({ columnType: "text" })
    @Field()
    @IsString()
    language: string;
}

@RootBlockEntity()
@ObjectType({
    implements: () => [DocumentInterface],
})
@Entity()
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class News extends BaseEntity<News, "id"> implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = v4();

    @Embedded(() => NewsContentScope)
    @Field(() => NewsContentScope)
    scope: NewsContentScope;

    @Property()
    @Field()
    slug: string;

    @Property()
    @Field()
    title: string;

    @Property()
    @Field()
    date: Date;

    @Enum({ items: () => NewsCategory })
    @Field(() => NewsCategory)
    category: NewsCategory;

    @Property({ default: false })
    @Field()
    visible: boolean;

    @Property({ customType: new RootBlockType(DamImageBlock) })
    @Field(() => GraphQLJSONObject)
    image: BlockDataInterface;

    @Property({ customType: new RootBlockType(NewsContentBlock) })
    @Field(() => GraphQLJSONObject)
    content: BlockDataInterface;

    @Property({
        columnType: "timestamp with time zone",
    })
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date(), columnType: "timestamp with time zone" })
    @Field()
    updatedAt: Date = new Date();
}
