export type BlobStorageFileUploadInterface = Omit<Express.Multer.File, "buffer" | "stream">;
