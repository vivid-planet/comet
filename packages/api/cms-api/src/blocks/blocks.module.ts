import { Global, Module } from "@nestjs/common";

import { BlockMigrateService } from "./block-migrate.service";
import { BlocksMetaService } from "./blocks-meta.service";
import { BlocksTransformerService } from "./blocks-transformer.service";
import { CreateBlockIndexViewsCommand } from "./create-block-index-views.command";
import { MigrateBlocksCommand } from "./migrate-blocks.command";
import { RefreshBlockIndexViewsCommand } from "./refresh-block-index-views.command";

@Global()
@Module({
    providers: [
        BlocksTransformerService,
        BlocksMetaService,
        BlockMigrateService,
        MigrateBlocksCommand,
        CreateBlockIndexViewsCommand,
        RefreshBlockIndexViewsCommand,
    ],
    exports: [BlocksTransformerService],
})
export class BlocksModule {}
