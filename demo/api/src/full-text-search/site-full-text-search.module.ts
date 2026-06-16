import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { SiteFullTextSearchResult } from "./entities/site-full-text-search-result.entity";
import { SiteFullTextSearchResolver } from "./site-full-text-search.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([SiteFullTextSearchResult])],
    providers: [SiteFullTextSearchResolver],
})
export class SiteFullTextSearchModule {}
