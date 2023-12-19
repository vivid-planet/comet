import { getBlocksMeta } from "@comet/blocks-api";
import { OnModuleInit } from "@nestjs/common";
import { promises as fs } from "fs";

export class BlocksMetaService implements OnModuleInit {
    async onModuleInit(): Promise<void> {
        const metaJson = getBlocksMeta();
        await fs.writeFile("block-meta.json", JSON.stringify(metaJson, null, 4));
    }
}
