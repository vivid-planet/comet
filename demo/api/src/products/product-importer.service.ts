import { EntityManager } from "@mikro-orm/core";
import { LocalFileDataStream } from "@src/importer/data-streams/local-file-data-stream";

import { ProductImporter } from "./product-importer";

export class ProductImporterService {
    constructor(private readonly em: EntityManager) {}

    async createImporter(filePath: string) {
        // TODO: Depending on future development, this might be better solved with dependency injection
        const importer = new ProductImporter(this.em);
        await importer.init({ dataStream: new LocalFileDataStream(filePath) });
        return importer;
    }
}
