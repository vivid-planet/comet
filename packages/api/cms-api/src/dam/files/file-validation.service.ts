import * as mimedb from "mime-db";

import { FileUploadInterface } from "./dto/file-upload.interface";

export class FileValidationService {
    constructor(public config: { maxFileSize: number; acceptedMimeTypes: string[] }) {}

    async validateFile(file: FileUploadInterface): Promise<true | string> {
        //maximum file size
        if (file.size > this.config.maxFileSize * 1024 * 1024) {
            return "File is too large";
        }

        //mime type in an accepted mime type
        if (!this.config.acceptedMimeTypes.includes(file.mimetype)) {
            return "Unsupported mime type";
        }

        //extension matched mime type
        const extension = file.originalname.split(".").pop()?.toLowerCase();
        if (extension === undefined) {
            return `Invalid file name: Missing file extension`;
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

        // svgContainsJavaScript check happens in the dedicated FileValidationInterceptor for technical reasons

        return true;
    }
}
