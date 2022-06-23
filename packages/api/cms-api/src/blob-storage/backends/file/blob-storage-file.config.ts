export interface BlobStorageFileConfig {
    driver: "file";
    file: {
        path: string;
    };
}
