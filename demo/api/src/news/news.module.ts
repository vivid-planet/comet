import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { News, NewsContentScope } from "@src/news/entities/news.entity";

import { NewsCrudResolver } from "./generated/news.crud.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([News, NewsContentScope])],
    providers: [NewsCrudResolver],
    exports: [],
})
export class NewsModule {}
