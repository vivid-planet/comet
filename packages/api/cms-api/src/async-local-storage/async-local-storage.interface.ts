// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AsyncLocalStoreOverrides {}

export interface CoreAsyncLocalStore {
    userId: string;
}

export type AsyncLocalStore = CoreAsyncLocalStore & AsyncLocalStoreOverrides;
