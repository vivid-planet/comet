import { pascalCase, pascalCaseTransformMerge } from "change-case";
import { Presets, SingleBar } from "cli-progress";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { format } from "oxfmt";
import * as path from "path";

// `src/generated` is in .gitignore, which makes Oxfmt skip it. The generated files are therefore formatted here,
// with the options of the repository's `.oxfmtrc.jsonc`.
const formatOptions = { printWidth: 150, tabWidth: 4 };

async function writeFormattedFile(filePath: string, sourceText: string) {
    const { code, errors } = await format(filePath, sourceText, formatOptions);
    if (errors.length > 0) {
        throw new Error(`Failed to format ${filePath}:\n${errors.map((error) => error.message).join("\n")}`);
    }
    writeFileSync(filePath, code);
}

type Icon = {
    name: string;
    path: string;
    componentName: string;
    deprecated?: boolean;
};

const main = async () => {
    const isSvg = (file: string) => path.extname(file).toLowerCase() === ".svg";

    const iconFiles = readdirSync("icons").filter(isSvg);
    const deprecatedIconFiles = existsSync("icons/deprecated") ? readdirSync("icons/deprecated").filter(isSvg) : [];

    const icons: Icon[] = [
        ...iconFiles.map((file) => ({ name: file, path: `icons/${file}`, componentName: getComponentName(file) })),
        ...deprecatedIconFiles.map((file) => ({
            name: file,
            path: `icons/deprecated/${file}`,
            componentName: getComponentName(file),
            deprecated: true,
        })),
    ];

    const bar = new SingleBar(
        {
            format: `{bar} {percentage}% | {value}/{total} {title}`,
        },
        Presets.shades_classic,
    );
    bar.start(icons.length, 0);

    if (existsSync("src/generated")) {
        rmSync("src/generated", { recursive: true });
    }

    mkdirSync("src/generated");
    await Promise.all(
        icons.map((icon) => {
            bar.increment(1, {
                title: `Generate icons ${icon.name}`,
            });
            const svgData = getSVGData(icon);

            const builder = new XMLBuilder({ ignoreAttributes: false });
            const svgString = builder.build(svgData);

            return writeComponent(icon, svgString);
        }),
    );
    bar.stop();

    await writeGeneratedTypesFile(icons);
    await writeIndexFile(icons);
};

const getComponentName = (fileName: string) => pascalCase(fileName.split(/[_.]/)[0], { transform: pascalCaseTransformMerge });

const getSVGData = (icon: Icon) => {
    const fileContents = readFileSync(icon.path);
    const parsedXml = new XMLParser({
        ignoreAttributes: false,
        updateTag(_, __, attrs) {
            delete attrs["@_fill"];
            // Convert all attribute keys to camelCase
            for (const key of Object.keys(attrs)) {
                const camelKey = key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
                if (camelKey !== key) {
                    attrs[camelKey] = attrs[key];
                    delete attrs[key];
                }
            }

            return true;
        },
    }).parse(fileContents.toString());

    return parsedXml.svg;
};

const writeComponent = async (icon: Icon, svgString: string) => {
    const searchTerms = icon.name.replace(/\.[^/.]+$/, "");
    const component = `
        import { SvgIcon, type SvgIconProps } from "@mui/material";
        import { forwardRef } from "react";

        ${
            icon.deprecated
                ? `/**
                    * @deprecated Will be removed in a future major release.
                    */`
                : ""
        }
        export const ${icon.componentName} = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
            return (
                <SvgIcon {...props} ref={ref} viewBox="0 0 16 16">
                    ${svgString}
                </SvgIcon>
            );
        });

        export const ${icon.componentName}SearchTerms = "${searchTerms}";
    `;
    if (icon.componentName != null && component != null) {
        await writeFormattedFile(`src/generated/${icon.componentName}.tsx`, component);
    }
};

const writeGeneratedTypesFile = async (icons: Icon[]) => {
    await writeFormattedFile(
        `src/generated/GeneratedIconName.ts`,
        `export type GeneratedIconName = ${icons.map((icon) => `"${icon.componentName}"`).join(" | ")};`,
    );
};

const writeIndexFile = async (icons: Icon[]) => {
    const exports = icons.map((icon) => {
        return `export { ${icon.componentName}, ${icon.componentName}SearchTerms } from "./${icon.componentName}";`;
    });

    const indexFile = await exports.join("\n");

    if (indexFile != null) {
        await writeFormattedFile(`src/generated/index.ts`, indexFile);
    }
};

main();
