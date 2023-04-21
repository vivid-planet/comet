import { Global, Module } from "@nestjs/common";

import { DependenciesService } from "./dependencies.service";
import { DiscoverService } from "./discover.service";

@Global()
@Module({
    imports: [],
    providers: [DiscoverService, DependenciesService],
    exports: [DiscoverService, DependenciesService],
})
export class DependenciesModule {}
