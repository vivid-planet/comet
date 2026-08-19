import { readFile } from "node:fs/promises";
import { dirname, join, parse, resolve } from "node:path";

import { format, type FormatConfig } from "oxfmt";

const configFileNames = [".oxfmtrc.json", ".oxfmtrc.jsonc"];

const configCache = new Map<string, FormatConfig>();

/**
 * Oxfmt config files may contain comments and trailing commas, `JSON.parse` may not.
 */
function parseJsonc(json: string) {
    let withoutComments = "";
    let isInString = false;
    let index = 0;

    while (index < json.length) {
        const character = json[index];
        if (isInString) {
            withoutComments += character;
            if (character === "\\") {
                withoutComments += json[index + 1] ?? "";
                index += 1;
            } else if (character === '"') {
                isInString = false;
            }
        } else if (character === '"') {
            isInString = true;
            withoutComments += character;
        } else if (character === "/" && json[index + 1] === "/") {
            while (index < json.length && json[index] !== "\n") {
                index += 1;
            }
            continue;
        } else if (character === "/" && json[index + 1] === "*") {
            index += 2;
            while (index < json.length && !(json[index] === "*" && json[index + 1] === "/")) {
                index += 1;
            }
            index += 1;
        } else {
            withoutComments += character;
        }
        index += 1;
    }

    const withoutTrailingCommas = withoutComments.replace(/("(?:[^"\\]|\\.)*")|,(\s*[}\]])/g, (match, string, closing) =>
        string === undefined ? closing : match,
    );

    return JSON.parse(withoutTrailingCommas);
}

/**
 * Oxfmt's Node API takes format options, it doesn't look for a config file the way its CLI does. Therefore resolve
 * the closest config file ourselves, so that generated files are formatted like the rest of the project.
 */
async function resolveConfig(directory: string): Promise<FormatConfig> {
    const cached = configCache.get(directory);
    if (cached) {
        return cached;
    }

    for (const configFileName of configFileNames) {
        const configFilePath = join(directory, configFileName);
        let contents: string;
        try {
            contents = await readFile(configFilePath, "utf-8");
        } catch {
            continue; // Try the next file name, then the parent directory.
        }

        let config: FormatConfig;
        try {
            config = parseJsonc(contents) as FormatConfig;
        } catch (error) {
            throw new Error(`Failed to parse ${configFilePath}: ${error instanceof Error ? error.message : error}`);
        }
        configCache.set(directory, config);
        return config;
    }

    const parentDirectory = dirname(directory);
    const config = parentDirectory === directory || directory === parse(directory).root ? {} : await resolveConfig(parentDirectory);
    configCache.set(directory, config);
    return config;
}

export async function formatWithOxfmt(filePath: string, sourceText: string): Promise<string> {
    // The config is looked up in the parent directories of the file, which requires an absolute path.
    const absoluteFilePath = resolve(filePath);
    const { code, errors } = await format(absoluteFilePath, sourceText, await resolveConfig(dirname(absoluteFilePath)));
    if (errors.length > 0) {
        throw new Error(`Failed to format ${absoluteFilePath}:\n${errors.map((error) => error.message).join("\n")}`);
    }
    return code;
}
