import { readFile } from "fs/promises";

import type { FileUploadInput } from "./file-upload.input";
import { getAcceptedMimetypeForExtension, getValidExtensionsForMimetype, isValidSvg } from "./files.utils";

const GENERIC_MIME_TYPE = "application/octet-stream";

export class FileValidationService {
    constructor(public config: { maxFileSize: number; acceptedMimeTypes: string[]; acceptedFileExtensionsForOctetStream?: string[] }) {}

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

        const extension = file.originalname.split(".").pop()?.toLowerCase();
        if (extension === undefined) {
            return "Invalid file name: Missing file extension";
        }

        const mimetype = this.getMimetype(file);

        //mime type in an accepted mime type
        if (!this.config.acceptedMimeTypes.includes(mimetype)) {
            return "Unsupported mime type";
        }

        //extension matched mime type
        const supportedExtensions = getValidExtensionsForMimetype(mimetype);
        if (supportedExtensions === undefined || !supportedExtensions.includes(extension)) {
            return `File type and extension mismatch: ${extension} and ${mimetype} are incompatible`;
        }

        return undefined;
    }

    /**
     * Returns the mime type the file should be treated and stored as.
     *
     * Some browsers upload certain files (e.g. .msg, .eml) with the generic `application/octet-stream`
     * mime type instead of their specific one. For the explicitly allow-listed extensions, the specific
     * mime type is resolved from the extension so the file is validated and persisted with its correct
     * mime type. Only the configured extensions are considered - arbitrary octet-stream uploads
     * (e.g. executables) keep the generic mime type.
     */
    getMimetype(file: Pick<FileUploadInput, "originalname" | "mimetype">): string {
        const extension = file.originalname.split(".").pop()?.toLowerCase();
        if (
            file.mimetype !== GENERIC_MIME_TYPE ||
            extension === undefined ||
            !this.config.acceptedFileExtensionsForOctetStream?.includes(extension)
        ) {
            return file.mimetype;
        }

        return getAcceptedMimetypeForExtension(extension, this.config.acceptedMimeTypes) ?? file.mimetype;
    }

    async validateFileContents(file: FileUploadInput): Promise<undefined | string> {
        if (this.getMimetype(file) === "image/svg+xml") {
            const fileContent = await readFile(file.path, { encoding: "utf-8" });

            if (!(await isValidSvg(fileContent))) {
                return "SVG contains forbidden content (e.g., JavaScript, security-relevant tags or attributes)";
            }
        }

        return undefined;
    }
}
