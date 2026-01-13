import { promises as fs } from "fs";
import { basename, dirname } from "path";

import { transformConfigFile } from "./transformConfig";

// TODO: Convert to import when converting the Admin Generator to ESM
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tsx = require("tsx/cjs/api");

export async function parseConfig(file: string) {
    //1. parse config file using TypeScript Complier Api and transform it (replace imports and functions that can't be executed)
    const transformedConfig = transformConfigFile(file, await fs.readFile(file, "utf-8"));

    //2. save modified config file to temp file
    const tempFileName = `${dirname(file)}/.temp-${basename(file)}`;
    await fs.writeFile(tempFileName, transformedConfig, "utf-8");

    //3. import (=execute) temp modified config file
    let executedConfig;
    try {
        executedConfig = tsx.require(tempFileName.replace(/\.tsx?$/, ""), __filename).default;
    } catch (e) {
        console.error(e);
        throw new Error(`Error executing config file ${file}: ${e}`);
    }
    await fs.rm(tempFileName);

    return executedConfig;
}
