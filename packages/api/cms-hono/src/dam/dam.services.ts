import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import type { BlobStorage } from "../blob-storage/blob-storage.js";
import type { ImgproxyService } from "../imgproxy/imgproxy.js";
import type { ResolvedDamConfig } from "./dam.config.js";
import type { DamSchema, DamScopeColumns } from "./db/dam.schema.js";
import { FilesService } from "./files/files.service.js";
import { FoldersService } from "./folders/folders.service.js";
import { ImagesService } from "./images/images.service.js";
import { DamItemsService } from "./items/dam-items.service.js";

export type DextinityDatabase = PgDatabase<PgQueryResultHKT>;

export interface DamServiceDependencies {
    db: DextinityDatabase;
    blobStorage: BlobStorage;
    imgproxy?: ImgproxyService;
    config: ResolvedDamConfig;
    schema: DamSchema;
    scopeColumns: DamScopeColumns;
}

export interface DamServices {
    files: FilesService;
    folders: FoldersService;
    items: DamItemsService;
    images: ImagesService;
}

/**
 * The counterpart of the providers of `DamModule`. Services reference each other through the container, which replaces NestJS's
 * `forwardRef` for the circular dependency between files and folders.
 */
export function createDamServices(dependencies: DamServiceDependencies): DamServices {
    const services = {} as DamServices;
    services.files = new FilesService(dependencies, services);
    services.folders = new FoldersService(dependencies, services);
    services.items = new DamItemsService(services);
    services.images = new ImagesService(dependencies, services);
    return services;
}
