import { Global, Module } from "@nestjs/common";

import { EntityInfoModule } from "./entity-info.module";
import { FULL_TEXT_SEARCH_ENABLED } from "./full-text-search.constants";
import { FullTextSearchResolver } from "./full-text-search.resolver";

/** @experimental */
@Global()
@Module({
    imports: [EntityInfoModule],
    providers: [FullTextSearchResolver, { provide: FULL_TEXT_SEARCH_ENABLED, useValue: true }],
    exports: [FULL_TEXT_SEARCH_ENABLED],
})
export class FullTextSearchModule {}
