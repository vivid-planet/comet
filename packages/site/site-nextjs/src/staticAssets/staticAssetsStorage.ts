import type { Readable } from "stream";

export type StaticAsset = {
    body: Readable;
    contentType?: string;
    cacheControl?: string;
};

export interface StaticAssetsStorage {
    /**
     * @returns `undefined` if the storage doesn't have the file
     */
    getFile(key: string): Promise<StaticAsset | undefined>;
    hasFile(key: string): Promise<boolean>;
    putFile(key: string, file: { body: Buffer; contentType?: string; cacheControl?: string }): Promise<void>;
}

/**
 * An [OpenDAL](https://opendal.apache.org/docs/bindings/nodejs/) service and its options,
 * e.g. `{ scheme: "s3", options: { bucket, region, endpoint, access_key_id, secret_access_key } }`
 * or `{ scheme: "azblob", options: { container, endpoint, account_name, account_key } }`
 */
export type StaticAssetsStorageConfig = {
    scheme: string;
    options: Record<string, string>;
};

/**
 * Creates the storage holding the static assets of every deployed build.
 * Requires the `opendal` package.
 */
export async function createStaticAssetsStorage({ scheme, options }: StaticAssetsStorageConfig): Promise<StaticAssetsStorage> {
    const { Operator } = await import("opendal");
    const operator = new Operator(scheme, options);

    return {
        async getFile(key) {
            try {
                const metadata = await operator.stat(key);
                const reader = await operator.reader(key);
                return {
                    body: reader.createReadStream(),
                    contentType: metadata.contentType ?? undefined,
                    cacheControl: metadata.cacheControl ?? undefined,
                };
            } catch (error) {
                if (isNotFoundError(error)) {
                    return undefined;
                }
                throw error;
            }
        },
        hasFile(key) {
            return operator.exists(key);
        },
        async putFile(key, { body, contentType, cacheControl }) {
            await operator.write(key, body, { contentType, cacheControl });
        },
    };
}

// OpenDAL's Node.js binding only reports the error kind in the message, e.g. "NotFound (permanent) at stat, ..."
function isNotFoundError(error: unknown): boolean {
    return error instanceof Error && error.message.startsWith("NotFound");
}
