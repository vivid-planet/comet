import { Module } from "@nestjs/common";

import { ProductImporterConsole } from "./product-importer.console";
import { ProductImporterService } from "./product-importer.service";

@Module({
    imports: [],
    providers: [ProductImporterConsole, ProductImporterService],
    exports: [ProductImporterService],
})
export class ProductImporterModule {}
