import { Global, Module } from "@nestjs/common";

import { BlockMigrateService } from "./block-migrate.service";
import { BlocksMetaService } from "./blocks-meta.service";
import { BlocksTransformerService } from "./blocks-transformer.service";
import { CommandsService } from "./commands.service";

@Global()
@Module({
    providers: [BlocksTransformerService, BlocksMetaService, CommandsService, BlockMigrateService],
    exports: [BlocksTransformerService],
})
export class BlocksModule {}
