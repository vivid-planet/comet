import { describe, expect, it } from "vitest";

import { FileValidationService } from "./file-validation.service";

const createFile = (originalname: string, mimetype: string) => ({
    fieldname: "file",
    originalname,
    encoding: "utf8",
    mimetype,
});

describe("FileValidationService", () => {
    describe("validateFileMetadata", () => {
        it("accepts a file with a matching specific mime type", () => {
            const service = new FileValidationService({ maxFileSize: 10, acceptedMimeTypes: ["application/pdf"] });

            expect(service.validateFileMetadata(createFile("document.pdf", "application/pdf"))).toBeUndefined();
        });

        it("rejects a file whose mime type is not accepted", () => {
            const service = new FileValidationService({ maxFileSize: 10, acceptedMimeTypes: ["application/pdf"] });

            expect(service.validateFileMetadata(createFile("image.png", "image/png"))).toBe("Unsupported mime type");
        });

        it("rejects a file whose extension does not match its mime type", () => {
            const service = new FileValidationService({ maxFileSize: 10, acceptedMimeTypes: ["application/pdf"] });

            expect(service.validateFileMetadata(createFile("document.png", "application/pdf"))).toBe(
                "File type and extension mismatch: png and application/pdf are incompatible",
            );
        });

        describe("application/octet-stream fallback", () => {
            it("accepts an allow-listed extension uploaded as application/octet-stream", () => {
                const service = new FileValidationService({
                    maxFileSize: 10,
                    acceptedMimeTypes: ["application/vnd.ms-outlook", "message/rfc822"],
                    acceptedFileExtensionsForOctetStream: ["msg", "eml"],
                });

                expect(service.validateFileMetadata(createFile("mail.msg", "application/octet-stream"))).toBeUndefined();
                expect(service.validateFileMetadata(createFile("mail.eml", "application/octet-stream"))).toBeUndefined();
            });

            it("still accepts the file when uploaded with its specific mime type", () => {
                const service = new FileValidationService({
                    maxFileSize: 10,
                    acceptedMimeTypes: ["application/vnd.ms-outlook"],
                    acceptedFileExtensionsForOctetStream: ["msg"],
                });

                expect(service.validateFileMetadata(createFile("mail.msg", "application/vnd.ms-outlook"))).toBeUndefined();
            });

            it("rejects an extension that is not allow-listed even if it maps to an accepted mime type", () => {
                const service = new FileValidationService({
                    maxFileSize: 10,
                    acceptedMimeTypes: ["application/vnd.ms-outlook"],
                    acceptedFileExtensionsForOctetStream: ["msg"],
                });

                expect(service.validateFileMetadata(createFile("archive.eml", "application/octet-stream"))).toBe("Unsupported mime type");
            });

            it("rejects executables uploaded as application/octet-stream", () => {
                const service = new FileValidationService({
                    maxFileSize: 10,
                    acceptedMimeTypes: ["application/vnd.ms-outlook"],
                    acceptedFileExtensionsForOctetStream: ["msg"],
                });

                expect(service.validateFileMetadata(createFile("malware.exe", "application/octet-stream"))).toBe("Unsupported mime type");
            });

            it("rejects an allow-listed extension whose specific mime type is not in acceptedMimeTypes", () => {
                const service = new FileValidationService({
                    maxFileSize: 10,
                    acceptedMimeTypes: ["application/pdf"],
                    acceptedFileExtensionsForOctetStream: ["msg"],
                });

                expect(service.validateFileMetadata(createFile("mail.msg", "application/octet-stream"))).toBe("Unsupported mime type");
            });

            it("does not accept application/octet-stream uploads when no extensions are allow-listed", () => {
                const service = new FileValidationService({
                    maxFileSize: 10,
                    acceptedMimeTypes: ["application/vnd.ms-outlook"],
                });

                expect(service.validateFileMetadata(createFile("mail.msg", "application/octet-stream"))).toBe("Unsupported mime type");
            });
        });
    });
});
