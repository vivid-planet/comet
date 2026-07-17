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

        const mimetype = this.resolveMimetype(file.mimetype, extension);

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
     * Some browsers upload certain files (e.g. .msg, .eml) with the generic `application/octet-stream`
     * mime type instead of their specific one. For the explicitly allow-listed extensions, resolve the
     * specific mime type from the extension so the upload can be validated like any other file. Only the
     * configured extensions are considered - arbitrary octet-stream uploads (e.g. executables) keep the
     * generic mime type and remain subject to the regular checks.
     */
    private resolveMimetype(mimetype: string, extension: string): string {
        if (mimetype !== GENERIC_MIME_TYPE || !this.config.acceptedFileExtensionsForOctetStream?.includes(extension)) {
            return mimetype;
        }

        return getAcceptedMimetypeForExtension(extension, this.config.acceptedMimeTypes) ?? mimetype;
    }

    async validateFileContents(file: FileUploadInput): Promise<undefined | string> {
        const extension = file.originalname.split(".").pop()?.toLowerCase();
        const mimetype = extension !== undefined ? this.resolveMimetype(file.mimetype, extension) : file.mimetype;

        if (mimetype === "image/svg+xml") {
            const fileContent = await readFile(file.path, { encoding: "utf-8" });

            if (!(await isValidSvg(fileContent))) {
                return "SVG contains forbidden content (e.g., JavaScript, security-relevant tags or attributes)";
            }
        }

        return undefined;
    }
}
