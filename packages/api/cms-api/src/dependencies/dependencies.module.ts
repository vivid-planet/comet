import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module } from "@nestjs/common";

import { EntityInfoModule } from "../entity-info/entity-info.module";
import { DEPENDENCIES_CONFIG, DependenciesConfig } from "./dependencies.constants";
import { DependenciesService } from "./dependencies.service";
import { DiscoverService } from "./discover.service";
import { BlockIndexDependencyObject } from "./entities/block-index-dependency.object";
import { BlockIndexRefresh } from "./entities/block-index-refresh.entity";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([BlockIndexRefresh, BlockIndexDependencyObject]), EntityInfoModule],
    providers: [DiscoverService, DependenciesService, { provide: DEPENDENCIES_CONFIG, useValue: {} }],
    exports: [DiscoverService, DependenciesService],
})
export class DependenciesModule {
    static register(config: DependenciesConfig = {}): DynamicModule {
        return {
            module: DependenciesModule,
            providers: [{ provide: DEPENDENCIES_CONFIG, useValue: config }],
        };
    }
}
