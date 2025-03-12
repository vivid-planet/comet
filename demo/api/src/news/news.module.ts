import { DependenciesResolverFactory, DependentsResolverFactory } from "@comet/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { News, NewsContentScope } from "@src/news/entities/news.entity";
import { WarningsModule } from "@src/warnings/warning.module";

import { NewsLinkBlockTransformerService } from "./blocks/news-link-block-transformer.service";
import { NewsComment } from "./entities/news-comment.entity";
import { ExtendedNewsResolver } from "./extended-news.resolver";
import { NewsResolver } from "./generated/news.resolver";
import { SyncNewsCommand } from "./news.command";
import { NewsCommentResolver } from "./news-comment.resolver";
import { NewsFieldResolver } from "./news-field.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([News, NewsComment, NewsContentScope]), WarningsModule],
    providers: [
        NewsResolver,
        NewsCommentResolver,
        NewsFieldResolver,
        DependenciesResolverFactory.create(News),
        DependentsResolverFactory.create(News),
        NewsLinkBlockTransformerService,
        ExtendedNewsResolver,
        SyncNewsCommand,
    ],
    exports: [],
})
export class NewsModule {}
