import { Presets, SingleBar } from "cli-progress";
import { ESLint } from "eslint";
import { XMLParser } from "fast-xml-parser";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { pascalCase, pascalCaseTransformMerge } from "pascal-case";
const eslint = new ESLint({ fix: true });

const main = async () => {
    const files = readdirSync("icons");

    const bar = new SingleBar(
        {
            format: `{bar} {percentage}% | {value}/{total} {title}`,
        },
        Presets.shades_classic,
    );
    bar.start(files.length, 0);

    if (existsSync("src/generated")) {
        rmSync("src/generated", { recursive: true });
    }

    mkdirSync("src/generated");
    await Promise.all(
        files.map((file) => {
            bar.increment(1, {
                title: `Generate icons ${file}`,
            });
            const componentName = getComponentName(file);
            const pathData = getPathData(file);

            return writeComponent(componentName, pathData);
        }),
    );
    bar.stop();

    await writeIndexFile(files);
};

const getComponentName = (fileName: string) => pascalCase(fileName.split(".")[0], { transform: pascalCaseTransformMerge });

const getPathData = (fileName: string) => {
    const fileContents = readFileSync(`icons/${fileName}`);
    const parsedXml = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" }).parse(fileContents.toString());

    return parsedXml.svg.path.d;
};

const getFormattedText = async (text: string) => {
    const results = await eslint.lintText(text, {
        // Configures ESLint to treat supplied text as TypeScript JSX file.
        // See docs: https://eslint.org/docs/latest/integrate/nodejs-api#-eslintlinttextcode-options
        filePath: "dummy.tsx",
    });

    return results[0].output;
};

const writeComponent = async (componentName: string, pathData: string) => {
    const component = await getFormattedText(`
        import { SvgIcon, SvgIconProps } from "@mui/material";
        import * as React from "react";
        
        export default function ${componentName}(props: SvgIconProps): JSX.Element {
            return (
                <SvgIcon {...props} viewBox="0 0 16 16">
                    <path d="${pathData}" />
                </SvgIcon>
            );
        }  
    `);

    if (componentName != null && component != null) {
        writeFileSync(`src/generated/${componentName}.tsx`, component);
    }
};

const writeIndexFile = async (files: string[]) => {
    const exports = files.map((file) => {
        const componentName = getComponentName(file);
        return `export { default as ${componentName} } from "./${componentName}";`;
    });

    const indexFile = await getFormattedText(exports.join("\n"));

    if (indexFile != null) {
        writeFileSync(`src/generated/index.ts`, indexFile);
    }
};

main();
