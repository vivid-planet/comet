import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { News, NewsContentScope } from "@src/news/entities/news.entity";

import { NewsComment } from "./entities/news-comment.entity";
import { NewsCrudResolver } from "./generated/news.crud.resolver";
import { NewsService } from "./generated/news.service";
import { NewsCommentResolver } from "./news-comment.resolver";
import { NewsFieldResolver } from "./news-field.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([News, NewsComment, NewsContentScope])],
    providers: [NewsCrudResolver, NewsCommentResolver, NewsService, NewsFieldResolver],
    exports: [],
})
export class NewsModule {}
