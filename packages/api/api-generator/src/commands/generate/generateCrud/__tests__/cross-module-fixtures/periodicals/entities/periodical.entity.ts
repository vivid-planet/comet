import { BaseEntity, Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { v4 as uuid } from "uuid";

import { ArticleToPeriodical } from "./article-to-periodical.entity";

@Entity()
export class Periodical extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    name: string;

    @OneToMany(() => ArticleToPeriodical, (articleToPeriodical) => articleToPeriodical.periodical, { orphanRemoval: true })
    articlesIncluded = new Collection<ArticleToPeriodical>(this);
}
