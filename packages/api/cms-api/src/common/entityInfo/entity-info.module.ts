import { Module } from "@nestjs/common";

import { EntityInfoService } from "./entity-info.service.js";

@Module({
    imports: [],
    providers: [EntityInfoService],
    exports: [EntityInfoService],
})
export class EntityInfoModule {}
