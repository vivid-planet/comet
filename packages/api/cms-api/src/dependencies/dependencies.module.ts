import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Global, Module } from "@nestjs/common";

import { EntityInfoModule } from "../common/entityInfo/entity-info.module.js";
import { DependenciesService } from "./dependencies.service.js";
import { DiscoverService } from "./discover.service.js";
import { BlockIndexRefresh } from "./entities/block-index-refresh.entity.js";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([BlockIndexRefresh]), EntityInfoModule],
    providers: [DiscoverService, DependenciesService],
    exports: [DiscoverService, DependenciesService],
})
export class DependenciesModule {}
