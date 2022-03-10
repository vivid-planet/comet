export type StorageMetaData = {
    size: number;
    etag?: string;
    lastModified?: Date;
    headers: Record<string, string>;
};

export type CreateFileOptions = {
    size: number;
    headers: StorageMetaData["headers"];
};

export interface BlobStorageBackendInterface {
    folderExists(folderName: string): Promise<boolean>;
    createFolder(folderName: string): Promise<void>;
    removeFolder(folderName: string): Promise<void>;
    fileExists(folderName: string, fileName: string): Promise<boolean>;
    createFile(folderName: string, fileName: string, data: NodeJS.ReadableStream | Buffer | string, options: CreateFileOptions): Promise<void>;
    getFile(folderName: string, fileName: string): Promise<NodeJS.ReadableStream>;
    getPartialFile(folderName: string, fileName: string, offset: number, length: number): Promise<NodeJS.ReadableStream>;
    getFileMetaData(folderName: string, fileName: string): Promise<StorageMetaData>;
    removeFile(folderName: string, fileName: string): Promise<void>;
    getBackendFilePathPrefix(): string;
}
