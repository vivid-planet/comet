import { Module } from "@nestjs/common";

import { ProductImporterModule } from "./importers/product-importer/product-importer.module";

@Module({
    imports: [ProductImporterModule],
    providers: [],
    exports: [],
})
export class ImporterModule {}
