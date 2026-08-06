import { BaseEntity, Entity, ManyToOne, PrimaryKey, type Ref } from "@mikro-orm/postgresql";
import { v4 as uuid } from "uuid";

import { Article } from "../../articles/entities/article.entity";
import { Periodical } from "./periodical.entity";

@Entity()
export class ArticleToPeriodical extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @ManyToOne(() => Article, { ref: true })
    article: Ref<Article>;

    @ManyToOne(() => Periodical, { ref: true })
    periodical: Ref<Periodical>;
}
