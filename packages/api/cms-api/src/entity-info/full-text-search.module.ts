import { Module } from "@nestjs/common";

import { EntityInfoModule } from "./entity-info.module";
import { FullTextSearchResolver } from "./full-text-search.resolver";

/** @experimental */
@Module({
    imports: [EntityInfoModule],
    providers: [FullTextSearchResolver],
})
export class FullTextSearchModule {}
