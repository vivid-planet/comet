import { ScopedEntity } from "@comet/cms-api";
import { BaseEntity, Entity, ManyToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { v4 as uuid } from "uuid";

import { News } from "./news.entity";

@Entity()
@ObjectType()
@ScopedEntity(async (newsComment: NewsComment) => {
    const news = await newsComment.news.init();

    if (!news) {
        throw new Error("News not found");
    }

    const scope = news.scope;
    return {
        domain: scope.domain as "main" | "secondary",
        language: scope.language,
    };
})
export class NewsComment extends BaseEntity {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = uuid();

    @ManyToOne(() => News)
    news!: News;

    @Property()
    @Field()
    comment: string;

    @Property({
        columnType: "timestamp with time zone",
    })
    @Field()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date(), columnType: "timestamp with time zone" })
    @Field()
    updatedAt: Date = new Date();
}
