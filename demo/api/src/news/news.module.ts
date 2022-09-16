import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { News, NewsContentScope } from "@src/news/entities/news.entity";

import { NewsComment } from "./entities/news-comment.entity";
import { NewsResolver } from "./news.resolver";
import { NewsCommentResolver } from "./news-comment.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([News, NewsComment, NewsContentScope])],
    providers: [NewsResolver, NewsCommentResolver],
    exports: [],
})
export class NewsModule {}
