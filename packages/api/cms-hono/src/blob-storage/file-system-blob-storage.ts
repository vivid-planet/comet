import { createReadStream } from "node:fs";
import { access, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { Readable } from "node:stream";

import type { BlobStorage, BlobStorageRange } from "./blob-storage.js";

/**
 * Node.js only. Uses the same directory layout as the `file` driver of `@dextinity/cms-api`, so both APIs and imgproxy can share the files.
 */
export class FileSystemBlobStorage implements BlobStorage {
    private readonly path: string;

    constructor({ path }: { path: string }) {
        this.path = resolve(path);
    }

    async fileExists(folderName: string, fileName: string): Promise<boolean> {
        try {
            await access(this.filePath(folderName, fileName));
            return true;
        } catch {
            return false;
        }
    }

    async createFile(folderName: string, fileName: string, data: Uint8Array<ArrayBuffer>): Promise<void> {
        const filePath = this.filePath(folderName, fileName);
        await mkdir(dirname(filePath), { recursive: true });
        await writeFile(filePath, data);
    }

    async getFile(folderName: string, fileName: string, range?: BlobStorageRange): Promise<ReadableStream<Uint8Array> | null> {
        if (!(await this.fileExists(folderName, fileName))) {
            return null;
        }
        const stream = createReadStream(
            this.filePath(folderName, fileName),
            range ? { start: range.offset, end: range.offset + range.length - 1 } : undefined,
        );
        return Readable.toWeb(stream) as ReadableStream<Uint8Array>;
    }

    async removeFile(folderName: string, fileName: string): Promise<void> {
        await rm(this.filePath(folderName, fileName), { force: true });
    }

    getImgproxySourceUrl(folderName: string, fileName: string): string {
        return `local:///${folderName}/${fileName}`;
    }

    private filePath(folderName: string, fileName: string): string {
        return `${this.path}/${folderName}/${fileName}`;
    }
}
