export interface FileUploadsConfig {
    directory: string;
    maxFileSize: number;
    acceptedMimeTypes: string[];
    /**
     * Allows setting an expiration duration, after this duration the file will be deleted.
     * The duration is in seconds.
     * Leaving it undefined means the file will never be deleted.
     *
     * @default undefined
     */
    expiresIn?: number;
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
