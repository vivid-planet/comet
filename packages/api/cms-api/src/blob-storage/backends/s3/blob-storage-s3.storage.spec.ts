import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import * as crypto from "crypto";
import { Readable } from "stream";

import { BlobStorageS3Storage } from "./blob-storage-s3.storage";

const S3_ENDPOINT = process.env.S3_ENDPOINT || "http://localhost:4566";
const S3_REGION = process.env.S3_REGION || "eu-central-1";
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY_ID || "test";
const S3_SECRET_KEY = process.env.S3_SECRET_ACCESS_KEY || "test";

function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
    });
}

async function isS3Available(): Promise<boolean> {
    try {
        const response = await fetch(`${S3_ENDPOINT}/_localstack/health`);
        return response.ok;
    } catch {
        return false;
    }
}

async function emptyBucket(client: S3Client, bucket: string): Promise<void> {
    let continuationToken: string | undefined;
    do {
        const response = await client.send(new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: continuationToken }));
        const objects = response.Contents?.map((o) => ({ Key: o.Key }));
        if (objects?.length) {
            await client.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: objects } }));
        }
        continuationToken = response.NextContinuationToken;
    } while (continuationToken);
}

/**
 * These tests require a local S3-compatible service (LocalStack) and only run locally.
 * Start it with: docker compose up localstack -d
 * They are skipped in CI and when LocalStack is not available.
 */
const describeLocalRunOnly = process.env.CI ? describe.skip : describe;

describeLocalRunOnly("BlobStorageS3Storage (LocalStack integration)", () => {
    let storage: BlobStorageS3Storage;
    let testBucket: string;
    let available: boolean;
    let cleanupClient: S3Client;

    beforeAll(async () => {
        available = await isS3Available();
        if (!available) {
            return;
        }

        testBucket = `test-${crypto.randomUUID()}`;

        const s3Config = {
            region: S3_REGION,
            endpoint: S3_ENDPOINT,
            bucket: testBucket,
            credentials: {
                accessKeyId: S3_ACCESS_KEY,
                secretAccessKey: S3_SECRET_KEY,
            },
            forcePathStyle: true,
        };

        storage = new BlobStorageS3Storage(s3Config);
        cleanupClient = new S3Client(s3Config);

        await storage.createFolder(testBucket);
    });

    afterAll(async () => {
        if (!available) {
            return;
        }

        try {
            await emptyBucket(cleanupClient, testBucket);
            await storage.removeFolder(testBucket);
        } catch {
            // Best-effort cleanup
        } finally {
            cleanupClient.destroy();
        }
    });

    beforeEach(() => {
        if (!available) {
            pending("LocalStack is not available, skipping S3 integration tests. Start it with: docker compose up localstack -d");
        }
    });

    describe("folderExists", () => {
        it("should return true for the test bucket", async () => {
            expect(await storage.folderExists("any-folder")).toBe(true);
        });
    });

    describe("fileExists", () => {
        it("should return false when the file does not exist", async () => {
            expect(await storage.fileExists("folder", "nonexistent.txt")).toBe(false);
        });

        it("should return true after a file is created", async () => {
            await storage.createFile("folder", "exists-check.txt", Buffer.from("check"), { contentType: "text/plain", size: 5 });
            expect(await storage.fileExists("folder", "exists-check.txt")).toBe(true);
        });
    });

    describe("createFile", () => {
        it("should upload a Buffer", async () => {
            await storage.createFile("uploads", "buf.txt", Buffer.from("hello buffer"), { contentType: "text/plain", size: 12 });

            const stream = await storage.getFile("uploads", "buf.txt");
            const content = await streamToBuffer(stream);
            expect(content.toString()).toBe("hello buffer");
        });

        it("should upload a Readable stream", async () => {
            const readable = Readable.from(["hello stream"]);
            await storage.createFile("uploads", "stream.txt", readable, { contentType: "text/plain", size: 12 });

            const stream = await storage.getFile("uploads", "stream.txt");
            const content = await streamToBuffer(stream);
            expect(content.toString()).toBe("hello stream");
        });
    });

    describe("getFile", () => {
        it("should return a readable stream with the file contents", async () => {
            await storage.createFile("get", "read-me.txt", Buffer.from("read this"), { contentType: "text/plain", size: 9 });

            const stream = await storage.getFile("get", "read-me.txt");
            const content = await streamToBuffer(stream);
            expect(content.toString()).toBe("read this");
        });
    });

    describe("getPartialFile", () => {
        it("should return only the requested byte range", async () => {
            await storage.createFile("partial", "range.txt", Buffer.from("0123456789"), { contentType: "text/plain", size: 10 });

            const stream = await storage.getPartialFile("partial", "range.txt", 3, 4);
            const content = await streamToBuffer(stream);
            expect(content.toString()).toBe("3456");
        });
    });

    describe("listFiles", () => {
        it("should return an empty array when no files exist in the folder", async () => {
            const files = await storage.listFiles("empty-folder");
            expect(files).toEqual([]);
        });

        it("should list files within a folder prefix", async () => {
            await storage.createFile("listing", "a.txt", Buffer.from("a"), { contentType: "text/plain", size: 1 });
            await storage.createFile("listing", "b.txt", Buffer.from("b"), { contentType: "text/plain", size: 1 });

            const files = await storage.listFiles("listing");
            expect(files.sort()).toEqual(["a.txt", "b.txt"]);
        });

        it("should not include files from other folders", async () => {
            await storage.createFile("folder-a", "file.txt", Buffer.from("a"), { contentType: "text/plain", size: 1 });
            await storage.createFile("folder-b", "file.txt", Buffer.from("b"), { contentType: "text/plain", size: 1 });

            const filesA = await storage.listFiles("folder-a");
            expect(filesA).toEqual(["file.txt"]);

            const filesB = await storage.listFiles("folder-b");
            expect(filesB).toEqual(["file.txt"]);
        });
    });

    describe("removeFile", () => {
        it("should remove a file so it no longer exists", async () => {
            await storage.createFile("remove", "gone.txt", Buffer.from("bye"), { contentType: "text/plain", size: 3 });
            await storage.removeFile("remove", "gone.txt");
            expect(await storage.fileExists("remove", "gone.txt")).toBe(false);
        });
    });

    describe("getFileMetaData", () => {
        it("should return size and contentType", async () => {
            const data = Buffer.from("metadata test");
            await storage.createFile("meta", "info.txt", data, { contentType: "text/plain", size: data.length });

            const meta = await storage.getFileMetaData("meta", "info.txt");

            expect(meta.size).toBe(data.length);
            expect(meta.contentType).toBe("text/plain");
            expect(meta.etag).toBeDefined();
        });
    });

    describe("getBackendFilePathPrefix", () => {
        it("should return the s3 prefix", () => {
            expect(storage.getBackendFilePathPrefix()).toBe("s3://");
        });
    });
});
