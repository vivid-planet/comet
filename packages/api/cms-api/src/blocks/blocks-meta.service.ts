import { getBlocksMeta } from "@comet/blocks-api";
import { Logger, OnModuleInit } from "@nestjs/common";
import { promises as fs } from "fs";

export class BlocksMetaService implements OnModuleInit {
    private readonly logger = new Logger(BlocksMetaService.name);

    async onModuleInit(): Promise<void> {
        let canWrite: boolean;

        try {
            await fs.access("block-meta.json", fs.constants.W_OK);
            canWrite = true;
        } catch (error) {
            this.logger.warn("Cannot write block-meta.json file");
            canWrite = false;
        }

        if (canWrite) {
            const metaJson = getBlocksMeta();
            await fs.writeFile("block-meta.json", JSON.stringify(metaJson, null, 4));
        }
    }
}
