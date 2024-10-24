export interface FileUploadsConfig {
    directory: string;
    maxFileSize: number;
    acceptedMimeTypes: string[];
    upload?: {
        public: boolean;
    };
    download?: {
        public?: boolean;
        secret: string;
    };
}
