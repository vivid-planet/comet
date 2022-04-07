export interface BlobStorageAzureConfig {
    driver: "azure";
    azure: {
        accountName: string;
        accountKey: string;
    };
}
