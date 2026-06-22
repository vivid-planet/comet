import {
    ActionLogs,
    BlockDataInterface,
    CrudField,
    CrudGenerator,
    DamImageBlock,
    EntityInfo,
    entityToMikroOrmFullText,
    RequiredPermission,
    RootBlock,
    RootBlockDataScalar,
    RootBlockEntity,
    RootBlockType,
    type SnapshotMigration,
} from "@comet/cms-api";
import {
    BaseEntity,
    Collection,
    Embeddable,
    Embedded,
    Entity,
    Enum,
    FullTextType,
    Index,
    OneToMany,
    OptionalProps,
    PrimaryKey,
    Property,
} from "@mikro-orm/postgresql";
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

// In Migration20250707093716 the `status` and `category` enum values were changed from PascalCase to camelCase
// (e.g. "Active" -> "active", "Events" -> "events"). Snapshots created before that migration still hold the old
// values, so they are mapped to the current ones when an old snapshot is read.
const migrateStatusAndCategoryToCamelCase: SnapshotMigration = {
    toVersion: 1,
    migrate: (snapshot) => {
        const statusMapping: Record<string, string> = { Active: "active", Deleted: "deleted" };
        const categoryMapping: Record<string, string> = { Events: "events", Company: "company", Awards: "awards" };
        return {
            ...snapshot,
            status: statusMapping[snapshot.status as string] ?? snapshot.status,
            category: categoryMapping[snapshot.category as string] ?? snapshot.category,
        };
    },
};

@EntityInfo<News>({
    name: "title",
    secondaryInformation: "slug",
    visible: { status: { $eq: NewsStatus.active } },
    fullText: "fullText",
})
@RequiredPermission("news")
@RootBlockEntity()
@ObjectType()
@Entity()
@ActionLogs({ snapshotMigrations: [migrateStatusAndCategoryToCamelCase] })
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

    @Index({ type: "fulltext" })
    @Property<News>({
        nullable: true,
        type: new FullTextType(),
        onCreate: (news) => entityToMikroOrmFullText({ A: news.title, D: news.slug }, news.content),
        onUpdate: (news) => entityToMikroOrmFullText({ A: news.title, D: news.slug }, news.content),
    })
    fullText?: string;
}
