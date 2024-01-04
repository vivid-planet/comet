import { getBlocksMeta } from "@comet/blocks-api";
import { OnModuleInit } from "@nestjs/common";
import { promises as fs } from "fs";
import { format, resolveConfig } from "prettier";

export class BlocksMetaService implements OnModuleInit {
    async onModuleInit(): Promise<void> {
        const metaJson = JSON.stringify(getBlocksMeta(), null, 4);

        const prettierOptions = await resolveConfig(process.cwd());
        const formattedMetaJson = format(metaJson, { ...prettierOptions, parser: "json" });

        await fs.writeFile("block-meta.json", formattedMetaJson);
    }
}
