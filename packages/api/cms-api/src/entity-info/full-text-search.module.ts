import { Module } from "@nestjs/common";

import { EntityInfoModule } from "./entity-info.module";
import { FullTextSearchResolver } from "./full-text-search.resolver";

@Module({
    imports: [EntityInfoModule],
    providers: [FullTextSearchResolver],
})
/** @experimental */
export class FullTextSearchModule {}
