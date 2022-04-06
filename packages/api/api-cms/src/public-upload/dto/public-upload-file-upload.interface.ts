export type PublicUploadFileUploadInterface = Omit<Express.Multer.File, "buffer" | "stream">;
