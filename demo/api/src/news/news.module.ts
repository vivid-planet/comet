import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { News, NewsContentScope } from "@src/news/entities/news.entity";

import { NewsResolver } from "./news.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([News, NewsContentScope])],
    providers: [NewsResolver],
    exports: [],
})
export class NewsModule {}
