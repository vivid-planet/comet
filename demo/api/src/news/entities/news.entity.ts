import { BlockDataInterface, RootBlock, RootBlockEntity } from "@comet/blocks-api";
import { CrudField, CrudGenerator, DamImageBlock, DocumentInterface, RootBlockDataScalar, RootBlockType } from "@comet/cms-api";
import {
    ArrayType,
    BaseEntity,
    Collection,
    Embeddable,
    Embedded,
    Entity,
    Enum,
    OneToMany,
    OptionalProps,
    PrimaryKey,
    Property,
} from "@mikro-orm/core";
import { Field, ID, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { v4 as uuid } from "uuid";

import { NewsContentBlock } from "../blocks/news-content.block";
import { NewsComment } from "./news-comment.entity";

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
    [OptionalProps]?: "createdAt" | "updatedAt" | "category"; // TODO remove "category" once CRUD generator supports enums

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

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
    category: NewsCategory = NewsCategory.Awards; // TODO remove default value once CRUD generator supports enums

    @Property({ default: false })
    @Field()
    visible: boolean;

    @RootBlock(DamImageBlock)
    @Property({ customType: new RootBlockType(DamImageBlock) })
    @Field(() => RootBlockDataScalar(DamImageBlock))
    image: BlockDataInterface;

    @RootBlock(NewsContentBlock)
    @Property({ customType: new RootBlockType(NewsContentBlock) })
    @Field(() => RootBlockDataScalar(NewsContentBlock))
    content: BlockDataInterface;

    @OneToMany(() => NewsComment, (newsComment) => newsComment.news)
    @CrudField({
        input: false,
    })
    comments = new Collection<NewsComment>(this);

    @Property({
        columnType: "timestamp with time zone",
    })
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date(), columnType: "timestamp with time zone" })
    @Field()
    updatedAt: Date = new Date();

    @Property({ type: ArrayType })
    @Field(() => [String])
    tags: string[];
}
