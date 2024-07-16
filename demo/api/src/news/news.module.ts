import { DependenciesResolverFactory, DependentsResolverFactory } from "@comet/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { News, NewsContentScope } from "@src/news/entities/news.entity";

import { NewsLinkBlockTransformerService } from "./blocks/news-link-block-transformer.service";
import { NewsComment } from "./entities/news-comment.entity";
import { NewsResolver } from "./generated/news.resolver";
import { NewsService } from "./generated/news.service";
import { NewsCommentResolver } from "./news-comment.resolver";
import { NewsFieldResolver } from "./news-field.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([News, NewsComment, NewsContentScope])],
    providers: [
        NewsResolver,
        NewsCommentResolver,
        NewsService,
        NewsFieldResolver,
        DependenciesResolverFactory.create(News),
        DependentsResolverFactory.create(News),
        NewsLinkBlockTransformerService,
    ],
    exports: [],
})
export class NewsModule {}
