import { ClientDefaults } from "@aws-sdk/client-s3";

export interface BlobStorageS3Config {
    driver: "s3";
    s3: {
        accessKeyId: string;
        secretAccessKey: string;
        endpoint: string;
        region: string;
        bucket: string;

        requestHandler?: ClientDefaults["requestHandler"];
    };
}
