import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Global, Module } from "@nestjs/common";

import { DependenciesService } from "./dependencies.service";
import { DiscoverService } from "./discover.service";
import { BlockIndexRefreshes } from "./entities/block-index-refreshes.entity";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([BlockIndexRefreshes])],
    providers: [DiscoverService, DependenciesService],
    exports: [DiscoverService, DependenciesService],
})
export class DependenciesModule {}
