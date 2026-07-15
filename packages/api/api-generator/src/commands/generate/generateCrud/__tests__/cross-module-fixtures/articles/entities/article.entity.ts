import { BaseEntity, Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { v4 as uuid } from "uuid";

import { ArticleToPeriodical } from "../../periodicals/entities/article-to-periodical.entity";

@Entity()
export class Article extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;

    @OneToMany(() => ArticleToPeriodical, (articleToPeriodical) => articleToPeriodical.article, { orphanRemoval: true })
    periodicalsIncludedIn = new Collection<ArticleToPeriodical>(this);
}
