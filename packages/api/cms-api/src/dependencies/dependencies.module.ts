import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Global, Module } from "@nestjs/common";

import { DependenciesService } from "./dependencies.service";
import { DiscoverService } from "./discover.service";
import { BlockIndexRefresh } from "./entities/block-index-refresh.entity";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([BlockIndexRefresh])],
    providers: [DiscoverService, DependenciesService],
    exports: [DiscoverService, DependenciesService],
})
export class DependenciesModule {}
