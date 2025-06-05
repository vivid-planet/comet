import { getRepositoryToken } from "@mikro-orm/nestjs";
import { EntityManager } from "@mikro-orm/postgresql";
import { Test, TestingModule } from "@nestjs/testing";
import { Readable } from "stream";

import { BlobStorageBackendService } from "../blob-storage/backends/blob-storage-backend.service";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsConfig } from "./file-uploads.config";
import { FILE_UPLOADS_CONFIG } from "./file-uploads.constants";
import { FileUploadsService } from "./file-uploads.service";

const mockBlobStorageBackendService = {
    upload: jest.fn(),
    fileExists: jest.fn(),
    getFile: jest.fn(),
};

const mockEntityManager = {
    persist: jest.fn(),
};

const mockRepository = {
    create: jest.fn(),
};

const mockConfig: FileUploadsConfig = {
    directory: "test-dir",
    download: {
        secret: "test-secret",
    },
    maxFileSize: 10485760, // 10 MB
    acceptedMimeTypes: ["image/png", "image/jpeg", "application/pdf"],
};

const fileUpload = {
    id: "mock-uuid",
    name: "testfile.txt",
    size: 123456,
    mimetype: "text/plain",
    contentHash: "abc123def456abc123def456abc123de",
    createdAt: new Date("2023-01-01T00:00:00Z"),
    updatedAt: new Date("2023-01-01T00:00:00Z"),
} as FileUpload;

describe("FileUploadsService", () => {
    let service: FileUploadsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FileUploadsService,
                { provide: getRepositoryToken(FileUpload), useValue: mockRepository },
                { provide: BlobStorageBackendService, useValue: mockBlobStorageBackendService },
                { provide: FILE_UPLOADS_CONFIG, useValue: mockConfig },
                { provide: EntityManager, useValue: mockEntityManager },
            ],
        }).compile();

        service = module.get<FileUploadsService>(FileUploadsService);

        jest.clearAllMocks();
    });

    describe("getFileContent", () => {
        it("should return file buffer if file exists", async () => {
            const buffer = Buffer.from("test");
            mockBlobStorageBackendService.fileExists.mockResolvedValue(true);
            mockBlobStorageBackendService.getFile.mockResolvedValue(Readable.from([buffer]));

            const result = await service.getFileContent(fileUpload);

            expect(result).toEqual(buffer);
            expect(mockBlobStorageBackendService.fileExists).toHaveBeenCalled();
            expect(mockBlobStorageBackendService.getFile).toHaveBeenCalled();
        });

        it("should throw if file does not exist", async () => {
            mockBlobStorageBackendService.fileExists.mockResolvedValue(false);

            await expect(service.getFileContent(fileUpload)).rejects.toThrow("File not found");
        });
    });
});
