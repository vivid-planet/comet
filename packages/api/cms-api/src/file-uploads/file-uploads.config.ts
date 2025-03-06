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
        /**
         * Allows disabling the `downloadUrl` and `imageUrl` field resolvers.
         * Use this when using file uploads without GraphQL.
         *
         * @default true
         */
        createFieldResolvers?: boolean;
    };
}
