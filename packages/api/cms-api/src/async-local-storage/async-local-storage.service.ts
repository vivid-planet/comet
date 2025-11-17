import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";

import { AsyncLocalStore } from "./async-local-storage.interface";

@Injectable()
export class AsyncLocalStorageService<T extends AsyncLocalStore = AsyncLocalStore> {
    private readonly storage = new AsyncLocalStorage<T>();

    run(callback: () => void): void {
        return this.storage.run({} as T, callback);
    }

    async runWith(store: T, callback: () => void): Promise<void> {
        return this.storage.run(store, callback);
    }

    set<K extends keyof T>(key: keyof T, value: T[K]): void {
        const store = this.storage.getStore();
        if (!store) {
            throw new Error("AsyncLocalStorage store is not initialized. Make sure to call set() within the context of run().");
        }
        store[key] = value;
    }

    get<K extends keyof T>(key: K): T[K] {
        const store = this.storage.getStore();
        if (!store) {
            throw new Error("AsyncLocalStorage store is not initialized. Make sure to call set() within the context of run().");
        }
        return store[key];
    }

    has(key: keyof T): boolean {
        const store = this.storage.getStore();
        return !!store && key in store;
    }
}
