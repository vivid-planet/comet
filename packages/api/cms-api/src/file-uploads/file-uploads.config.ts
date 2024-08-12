export interface FileUploadsConfig {
    directory: string;
    maxFileSize: number;
    acceptedMimeTypes: string[];
    upload?: {
        public: boolean;
    };
    download?: {
        secret: string;
    };
}
