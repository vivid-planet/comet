import { ActionLogsModule, DependenciesResolverFactory, DependentsResolverFactory } from "@comet/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { News, NewsContentScope } from "@src/news/entities/news.entity";
import { Manufacturer } from "@src/products/entities/manufacturer.entity";
import { Product } from "@src/products/entities/product.entity";

import { NewsLinkBlockTransformerService } from "./blocks/news-link-block-transformer.service";
import { NewsComment } from "./entities/news-comment.entity";
import { ExtendedNewsResolver } from "./extended-news.resolver";
import { NewsResolver } from "./generated/news.resolver";
import { NewsCommentResolver } from "./news-comment.resolver";
import { NewsFieldResolver } from "./news-field.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([News, NewsComment, NewsContentScope]), ActionLogsModule.forFeature([Product, Manufacturer])],
    providers: [
        NewsResolver,
        NewsCommentResolver,
        NewsFieldResolver,
        DependenciesResolverFactory.create(News),
        DependentsResolverFactory.create(News),
        NewsLinkBlockTransformerService,
        ExtendedNewsResolver,
    ],
    exports: [],
})
export class NewsModule {}
