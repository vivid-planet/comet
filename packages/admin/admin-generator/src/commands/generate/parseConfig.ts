/* eslint-disable @typescript-eslint/no-explicit-any */

import { promises as fs } from "fs";
import { basename, dirname, isAbsolute } from "path";

import { configFromSourceFile, morphTsSource } from "./utils/tsMorphHelper";

function combineExecutedAndParsedConfigs(executedConfig: any, parsedConfig: any, jsonPath = ""): any {
    if (Array.isArray(parsedConfig)) {
        return Array.from(parsedConfig.keys()).map((key) => {
            if (parsedConfig[key]) {
                return combineExecutedAndParsedConfigs(executedConfig[key], parsedConfig[key], `${jsonPath ? `${jsonPath}.` : ""}${key}`);
            } else {
                return executedConfig[key];
            }
        });
    } else if (executedConfig == "__COMET_IMPORT") {
        return parsedConfig;
    } else if (executedConfig == "__COMET_CODE") {
        return parsedConfig;
    } else if (typeof parsedConfig == "object") {
        return Object.fromEntries(
            Object.entries(parsedConfig).map(([key]) => {
                if (parsedConfig[key]) {
                    return [key, combineExecutedAndParsedConfigs(executedConfig[key], parsedConfig[key], `${jsonPath ? `${jsonPath}.` : ""}${key}`)];
                } else {
                    return [key, executedConfig[key]];
                }
            }),
        );
    } else {
        return executedConfig;
    }
}

export async function parseConfig(file: string) {
    //1. parse the config with ts-morph, replaces all imports with "__COMET_IMPORT" and all inline code with "__COMET_CODE" in the AST
    const tsMorphSource = morphTsSource(file);
    const parsedConfig = configFromSourceFile(tsMorphSource);

    //2. save modified AST config file to temp file
    const tempFileName = `${dirname(file)}/.temp-${basename(file)}`;

    await tsMorphSource.move(isAbsolute(tempFileName) ? tempFileName : `${process.cwd()}/${tempFileName}`, { overwrite: true });
    await tsMorphSource.save();

    //3. import (=execute) temp modified config file
    let executedConfig;
    try {
        const configFile = await import(tempFileName.replace(/\.tsx?$/, ""));
        if (!configFile.default) {
            throw new Error(`No default export found in ${file}`);
        }
        executedConfig = configFile.default;
    } catch (e) {
        console.error(e);
        throw new Error(`Error executing config file ${file}: ${e}`);
    }
    await fs.rm(tempFileName);

    //4. combine the executed config with the parsed config to replace "__COMET_CODE" and "__COMET_IMPORT"
    const config = combineExecutedAndParsedConfigs(executedConfig, parsedConfig);
    return config;
}
