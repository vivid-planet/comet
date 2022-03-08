import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { News } from "@src/news/entities/news.entity";

import { NewsResolver } from "./news.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([News])],
    providers: [NewsResolver],
    exports: [],
})
export class NewsModule {}
