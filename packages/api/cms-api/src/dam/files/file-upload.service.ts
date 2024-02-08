import { Injectable } from "@nestjs/common";
import FileType from "file-type";
import fs from "fs";
import got from "got";
import os from "os";
import stream from "stream";
import { promisify } from "util";
import { v4 as uuid } from "uuid";

import { FileUploadInput } from "./dto/file-upload.input";
import { FilesService } from "./files.service";

const pipeline = promisify(stream.pipeline);

@Injectable()
class FileUploadService {
    async createFileUploadInputFromUrl(url: string): Promise<FileUploadInput> {
        const tempDir = fs.mkdtempSync(`${os.tmpdir()}/download`);
        const fakeName = uuid();
        const tempFile = `${tempDir}/${fakeName}`;

        if (url.substring(0, 4) === "http") {
            await pipeline(got.stream(url), fs.createWriteStream(tempFile));
            //TODO when downloading the file from http use mime type from reponse header
        } else {
            fs.copyFileSync(url, tempFile);
        }

        const fileType = await FileType.fromFile(tempFile);
        const stats = fs.statSync(tempFile); // TODO don't use sync
        const filename = url.substring(url.lastIndexOf("/") + 1);

        return {
            fieldname: FilesService.UPLOAD_FIELD,
            originalname: `${filename}.${fileType?.ext}`,
            encoding: "utf8",
            mimetype: fileType?.mime as string,
            size: stats.size,
            destination: tempDir,
            filename: fakeName,
            path: tempFile,
        };
    }
}

/**
 * @deprecated use FileUploadService#createFileUploadInputFromUrl instead
 */
const download = FileUploadService.prototype.createFileUploadInputFromUrl;

export { download, FileUploadService };
