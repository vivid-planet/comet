import { File } from "../dam/files/entities/file.entity";

export interface BlockIndexDefinition {
    name: string;
    entityName: string;
}

export const DamFileIndexDefinition: BlockIndexDefinition = {
    name: "DamFileIndex",
    entityName: File.name,
};

export const PAGE_INDEX_NAME = "PageIndex";
