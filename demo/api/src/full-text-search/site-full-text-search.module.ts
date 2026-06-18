import { Module } from "@nestjs/common";

import { SiteFullTextSearchResolver } from "./site-full-text-search.resolver";

@Module({
    providers: [SiteFullTextSearchResolver],
})
export class SiteFullTextSearchModule {}
