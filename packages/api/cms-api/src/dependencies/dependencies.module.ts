import { Global, Module } from "@nestjs/common";

import { BlockIndexService } from "./block-index.service";
import { DiscoverService } from "./discover.service";

@Global()
@Module({
    imports: [],
    providers: [DiscoverService, BlockIndexService],
    exports: [DiscoverService, BlockIndexService],
})
export class DependenciesModule {}
