import { pascalCase, pascalCaseTransformMerge } from "change-case";
import { Presets, SingleBar } from "cli-progress";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import * as path from "path";

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

const getComponentName = (fileName: string) => pascalCase(fileName.split(".")[0], { transform: pascalCaseTransformMerge });

const getSVGData = (icon: Icon) => {
    const fileContents = readFileSync(icon.path);
    const parsedXml = new XMLParser({
        ignoreAttributes: false,
        updateTag(_, __, attrs) {
            delete attrs["@_fill"];
            return true;
        },
    });
    const parsed = parsedXml.parse(fileContents.toString());

    return convertAttributesToCamelCase(parsed.svg);
};

const convertAttributesToCamelCase = (node: any): any => {
    if (Array.isArray(node)) {
        return node.map(convertAttributesToCamelCase);
    }

    if (typeof node !== "object" || node === null) {
        return node;
    }

    const result: any = {};

    for (const [key, value] of Object.entries(node)) {
        const camelCaseKey = key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
        result[camelCaseKey] = convertAttributesToCamelCase(value);
    }

    return result;
};

const writeComponent = async (icon: Icon, svgString: string) => {
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
    `;
    if (icon.componentName != null && component != null) {
        writeFileSync(`src/generated/${icon.componentName}.tsx`, component);
    }
};

const writeGeneratedTypesFile = async (icons: Icon[]) => {
    writeFileSync(
        `src/generated/GeneratedIconName.ts`,
        `export type GeneratedIconName = ${icons.map((icon) => `"${icon.componentName}"`).join(" | ")};`,
    );
};

const writeIndexFile = async (icons: Icon[]) => {
    const exports = icons.map((icon) => {
        return `export { ${icon.componentName} } from "./${icon.componentName}";`;
    });

    const indexFile = await exports.join("\n");

    if (indexFile != null) {
        writeFileSync(`src/generated/index.ts`, indexFile);
    }
};

main();
