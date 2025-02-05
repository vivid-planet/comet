import { type StorageMetaData } from "../../../blob-storage/backends/blob-storage-backend.interface";

export interface FileCache {
    file: NodeJS.ReadableStream;
    metaData: StorageMetaData;
}
