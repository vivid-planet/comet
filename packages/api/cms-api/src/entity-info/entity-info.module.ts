import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { EntityInfoObject } from "./entity-info.object";
import { EntityInfoService } from "./entity-info.service";
import { FullTextSearchResolver } from "./full-text-search.resolver";

@Module({
    imports: [MikroOrmModule.forFeature([EntityInfoObject])],
    providers: [EntityInfoService, FullTextSearchResolver],
    exports: [EntityInfoService],
})
export class EntityInfoModule {}
