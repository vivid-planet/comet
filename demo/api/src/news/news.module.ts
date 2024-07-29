import { DependenciesResolverFactory, DependentsResolverFactory } from "@comet/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { News, NewsContentScope } from "@src/news/entities/news.entity";

import { NewsComment } from "./entities/news-comment.entity";
import { NewsResolver } from "./generated/news.resolver";
import { NewsCommentResolver } from "./news-comment.resolver";
import { NewsFieldResolver } from "./news-field.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([News, NewsComment, NewsContentScope])],
    providers: [
        NewsResolver,
        NewsCommentResolver,
        NewsFieldResolver,
        DependenciesResolverFactory.create(News),
        DependentsResolverFactory.create(News),
    ],
    exports: [],
})
export class NewsModule {}
