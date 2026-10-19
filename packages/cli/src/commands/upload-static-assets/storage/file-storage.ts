import { copyFile, mkdir } from "fs/promises";
import { dirname, join } from "path";

import type { StaticAssetsStorage } from "./storage";

export class FileStaticAssetsStorage implements StaticAssetsStorage {
    constructor(private readonly config: { path: string }) {}

    async uploadFile(key: string, filePath: string): Promise<void> {
        const targetPath = join(this.config.path, key);
        await mkdir(dirname(targetPath), { recursive: true });
        await copyFile(filePath, targetPath);
    }
}
