import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Global, Module } from "@nestjs/common";

import { EntityInfoModule } from "../entity-info/entity-info.module";
import { DependenciesService } from "./dependencies.service";
import { DiscoverService } from "./discover.service";
import { BlockIndexRefresh } from "./entities/block-index-refresh.entity";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([BlockIndexRefresh]), EntityInfoModule],
    providers: [DiscoverService, DependenciesService],
    exports: [DiscoverService, DependenciesService],
})
export class DependenciesModule {}
