import * as fs from "fs";
import * as path from "path";
import { PassThrough, type Readable, Stream } from "stream";

import { type BlobStorageBackendInterface, type CreateFileOptions, type StorageMetaData } from "../blob-storage-backend.interface";
import { type BlobStorageFileConfig } from "./blob-storage-file.config";

export class BlobStorageFileStorage implements BlobStorageBackendInterface {
    private readonly headersFile = "headers.json";
    private readonly path: string;

    constructor(config: BlobStorageFileConfig["file"]) {
        this.path = path.resolve(config.path);
    }

    async folderExists(folderName: string): Promise<boolean> {
        try {
            await fs.promises.access(`${this.path}/${folderName}`);
        } catch {
            return false;
        }

        return true;
    }

    async createFolder(folderName: string): Promise<void> {
        await fs.promises.mkdir(`${this.path}/${folderName}`, { recursive: true });
    }

    async removeFolder(folderName: string): Promise<void> {
        await fs.promises.rm(`${this.path}/${folderName}`, { recursive: true, force: true });
    }

    async fileExists(folderName: string, fileName: string): Promise<boolean> {
        if (!(await this.folderExists(`${folderName}/${path.dirname(fileName)}`))) {
            await this.createFolder(`${folderName}/${path.dirname(fileName)}`);
        }

        try {
            await fs.promises.access(`${this.path}/${folderName}/${fileName}`);
        } catch {
            return false;
        }

        return true;
    }

    async createFile(
        folderName: string,
        fileName: string,
        data: NodeJS.ReadableStream | Buffer | string,
        { contentType }: CreateFileOptions,
    ): Promise<void> {
        if (!(await this.folderExists(`${folderName}/${path.dirname(fileName)}`))) {
            await this.createFolder(`${folderName}/${path.dirname(fileName)}`);
        }

        await Promise.all([
            new Promise<void>((resolve, reject) => {
                const stream = fs.createWriteStream(`${this.path}/${folderName}/${fileName}`);
                stream.on("error", reject);
                stream.on("finish", resolve);

                if (typeof data === "string") {
                    fs.createReadStream(data).pipe(stream);
                } else if (data instanceof Stream) {
                    data.pipe(stream);
                } else {
                    stream.write(data);
                    stream.end();
                }
            }),
            await fs.promises.writeFile(
                `${this.path}/${folderName}/${fileName}-${this.headersFile}`,
                JSON.stringify({ "content-type": contentType }),
                {
                    encoding: "utf-8",
                },
            ),
        ]);
    }

    async getFile(folderName: string, fileName: string): Promise<Readable> {
        return fs.createReadStream(`${this.path}/${folderName}/${fileName}`);
    }

    async getPartialFile(folderName: string, fileName: string, offset: number, length: number): Promise<Readable> {
        return fs.createReadStream(`${this.path}/${folderName}/${fileName}`, {
            start: offset,
            end: offset + length - 1,
        });
    }

    async listFiles(folderName: string): Promise<Readable> {
        const stream = new PassThrough({ objectMode: true });
        this.populateListFilesStream(folderName, stream).catch((error) => stream.destroy(error));
        return stream;
    }

    private async populateListFilesStream(folderName: string, stream: PassThrough): Promise<void> {
        const basePath = path.resolve(this.path);
        const dirPath = path.join(basePath, folderName);

        let entries: fs.Dirent[];
        try {
            entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
        } catch (error) {
            // The directory may not exist yet (e.g., no files have been uploaded for this folder).
            // In that case, readdir throws ENOENT, and we treat it as an empty listing.
            if ((error as NodeJS.ErrnoException).code === "ENOENT") {
                stream.end();
                return;
            }
            stream.destroy(error as Error);
            return;
        }

        for (const entry of entries) {
            if (!entry.isFile() || entry.name.endsWith(`-${this.headersFile}`)) {
                continue;
            }

            const filePath = path.join(dirPath, entry.name);
            const headersPath = `${filePath}-${this.headersFile}`;

            const stat = await fs.promises.stat(filePath);
            let contentType = "application/octet-stream";
            try {
                const rawHeaders = await fs.promises.readFile(headersPath, { encoding: "utf-8" });
                contentType = JSON.parse(rawHeaders)["content-type"] ?? contentType;
            } catch (error) {
                if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
                    throw error;
                }
            }
            stream.push({
                name: entry.name,
                stream: fs.createReadStream(filePath),
                size: stat.size,
                contentType,
            });
        }

        stream.end();
    }

    async removeFile(folderName: string, fileName: string): Promise<void> {
        await Promise.all([
            await fs.promises.rm(`${this.path}/${folderName}/${fileName}`, { force: true }),
            await fs.promises.rm(`${this.path}/${folderName}/${fileName}-${this.headersFile}`, { force: true }),
        ]);
    }

    async getFileMetaData(folderName: string, fileName: string): Promise<StorageMetaData> {
        const stat = await fs.promises.stat(`${this.path}/${folderName}/${fileName}`);
        const rawHeaders = await fs.promises.readFile(`${this.path}/${folderName}/${fileName}-${this.headersFile}`, {
            encoding: "utf-8",
        });
        const headers = JSON.parse(rawHeaders);

        return {
            size: stat.size,
            lastModified: stat.mtime,
            contentType: headers["content-type"],
        };
    }

    getBackendFilePathPrefix(): string {
        return "local:///";
    }
}
