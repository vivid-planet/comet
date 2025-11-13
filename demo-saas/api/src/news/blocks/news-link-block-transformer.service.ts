import { BlockTransformerServiceInterface } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import type { News } from "../entities/news.entity";
import { NewsLinkBlockData } from "./news-link.block";

type TransformResponse = {
    news?: {
        id: string;
        slug: string;
        scope: {
            domain: string;
            language: string;
        };
    };
};

@Injectable()
export class NewsLinkBlockTransformerService implements BlockTransformerServiceInterface<NewsLinkBlockData, TransformResponse> {
    constructor(@InjectRepository("News") private readonly repository: EntityRepository<News>) {}

    async transformToPlain(block: NewsLinkBlockData) {
        if (!block.id) {
            return {};
        }

        const news = await this.repository.findOneOrFail(block.id);

        return {
            news: {
                id: news.id,
                slug: news.slug,
                scope: news.scope,
            },
        };
    }
}
