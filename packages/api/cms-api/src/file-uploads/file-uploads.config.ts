export interface FileUploadsConfig {
    directory: string;
    maxFileSize: number;
    acceptedMimeTypes: string[];
    upload?: {
        public: boolean;
    };
    download?: {
        apiUrl: string;
        secret: string;
    };
}
