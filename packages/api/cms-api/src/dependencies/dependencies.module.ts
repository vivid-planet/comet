import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Global, Module } from "@nestjs/common";

import { DependenciesService } from "./dependencies.service";
import { DiscoverService } from "./discover.service";
import { RefreshBlockIndex } from "./entities/refresh-block-index.entity";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([RefreshBlockIndex])],
    providers: [DiscoverService, DependenciesService],
    exports: [DiscoverService, DependenciesService],
})
export class DependenciesModule {}
