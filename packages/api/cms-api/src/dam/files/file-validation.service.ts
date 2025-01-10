import { readFile } from "fs/promises";
import * as mimedb from "mime-db";

import { FileUploadInput } from "./dto/file-upload.input";
import { svgContainsJavaScript } from "./files.utils";

export class FileValidationService {
    constructor(public config: { maxFileSize: number; acceptedMimeTypes: string[] }) {}

    async validateFile(file: FileUploadInput): Promise<undefined | string> {
        let error = this.validateFileMetadata(file);

        if (error === undefined) {
            error = await this.validateFileContents(file);
        }

        return error;
    }

    validateFileMetadata(file: Pick<FileUploadInput, "fieldname" | "originalname" | "encoding" | "mimetype">): undefined | string {
        //maximum filename length
        if (file.originalname.length > 255) {
            return "Filename is too long";
        }

        //mime type in an accepted mime type
        if (!this.config.acceptedMimeTypes.includes(file.mimetype)) {
            return "Unsupported mime type";
        }

        //extension matched mime type
        const extension = file.originalname.split(".").pop()?.toLowerCase();
        if (extension === undefined) {
            return "Invalid file name: Missing file extension";
        }

        let supportedExtensions: readonly string[] | undefined;
        if (file.mimetype === "application/x-zip-compressed") {
            // zip files in Windows, not supported by mime-db
            // see https://github.com/jshttp/mime-db/issues/245
            supportedExtensions = ["zip"];
        } else {
            supportedExtensions = mimedb[file.mimetype]?.extensions;
        }

        if (supportedExtensions === undefined || !supportedExtensions.includes(extension)) {
            return `File type and extension mismatch: .${extension} and ${file.mimetype} are incompatible`;
        }

        return undefined;
    }

    async validateFileContents(file: FileUploadInput): Promise<undefined | string> {
        if (file.mimetype === "image/svg+xml") {
            const fileContent = await readFile(file.path, { encoding: "utf-8" });

            if (svgContainsJavaScript(fileContent)) {
                return "SVG must not contain JavaScript";
            }
        }

        return undefined;
    }
}
