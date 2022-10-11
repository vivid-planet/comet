import { File } from "../dam/files/entities/file.entity";

export interface BlockIndexDependencyDefinition {
    name: string;
    entityName: string;
}

export const DamFileBlockIndexDependency: BlockIndexDependencyDefinition = {
    name: "DamFileDependency",
    entityName: File.name,
};

export const PAGE_BLOCK_INDEX_DEPENDENCY_NAME = "PageDependency";
