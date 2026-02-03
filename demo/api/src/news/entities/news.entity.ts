import {
    BlockDataInterface,
    CrudField,
    CrudGenerator,
    DamImageBlock,
    EntityInfo,
    RootBlock,
    RootBlockDataScalar,
    RootBlockEntity,
    RootBlockType,
} from "@comet/cms-api";
import { BaseEntity, Collection, Embeddable, Embedded, Entity, Enum, OneToMany, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, ID, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { v4 as uuid } from "uuid";

import { NewsContentBlock } from "../blocks/news-content.block";
import { NewsComment } from "./news-comment.entity";

export enum NewsStatus {
    active = "active",
    deleted = "deleted",
}
registerEnumType(NewsStatus, { name: "NewsStatus" });

export enum NewsCategory {
    events = "events",
    company = "company",
    awards = "awards",
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

@EntityInfo<News>((news) => ({ name: news.title, secondaryInformation: news.slug }))
@RootBlockEntity()
@ObjectType()
@Entity()
@CrudGenerator({ requiredPermission: ["news"] })
export class News extends BaseEntity {
    [OptionalProps]?: "createdAt" | "updatedAt" | "status";

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

    @Enum({ items: () => NewsStatus })
    @Field(() => NewsStatus)
    status: NewsStatus = NewsStatus.active;

    @Property()
    @Field()
    date: Date;

    @Enum({ items: () => NewsCategory })
    @Field(() => NewsCategory)
    category: NewsCategory;

    @RootBlock(DamImageBlock)
    @Property({ type: new RootBlockType(DamImageBlock) })
    @Field(() => RootBlockDataScalar(DamImageBlock))
    image: BlockDataInterface;

    @RootBlock(NewsContentBlock)
    @Property({ type: new RootBlockType(NewsContentBlock) })
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
}
