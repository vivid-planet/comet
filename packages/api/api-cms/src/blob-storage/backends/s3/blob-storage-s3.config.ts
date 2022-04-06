export interface BlobStorageS3Config {
    driver: "s3";
    s3: {
        accessKeyId: string;
        secretAccessKey: string;
        endpoint: string;
        region: string;
    };
}
