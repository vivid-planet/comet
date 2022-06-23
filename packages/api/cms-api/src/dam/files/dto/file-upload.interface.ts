export type FileUploadInterface = Omit<Express.Multer.File, "buffer" | "stream">;
