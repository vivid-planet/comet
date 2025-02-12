import { CreateRequestContext, MikroORM } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Command, Console } from "nestjs-console";

import { ProductImporterService } from "./product-importer.service";

@Injectable()
@Console()
export class ProductImporterConsole {
    constructor(private readonly orm: MikroORM, private readonly productImporterService: ProductImporterService) {}

    @CreateRequestContext()
    @Command({
        command: "product-import <filePath>",
        description: "Start import",
    })
    async execute(filePath: string): Promise<void> {
        const importer = await this.productImporterService.createImporter(filePath);
        await importer.executeRun();
    }
}
