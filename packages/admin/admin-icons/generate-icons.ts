import { Presets, SingleBar } from "cli-progress";
import { ESLint } from "eslint";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { pascalCase, pascalCaseTransformMerge } from "pascal-case";
import * as path from "path";

const eslint = new ESLint({ fix: true });

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
    }).parse(fileContents.toString());

    return parsedXml.svg;
};

const getFormattedText = async (text: string) => {
    const results = await eslint.lintText(text, {
        // Configures ESLint to treat supplied text as TypeScript JSX file.
        // See docs: https://eslint.org/docs/latest/integrate/nodejs-api#-eslintlinttextcode-options
        filePath: "dummy.tsx",
    });

    return results[0].output;
};

const writeComponent = async (icon: Icon, svgString: string) => {
    const component = await getFormattedText(`
        import { SvgIcon, SvgIconProps } from "@mui/material";
        import * as React from "react";
        
        ${
            icon.deprecated
                ? `/**
                    * @deprecated Will be removed in a future major release.
                    */`
                : ""
        };
        export const ${icon.componentName} = React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
            return (
                <SvgIcon {...props} ref={ref} viewBox="0 0 16 16">
                    ${svgString}
                </SvgIcon>
            );
        });
    `);

    if (icon.componentName != null && component != null) {
        writeFileSync(`src/generated/${icon.componentName}.tsx`, component);
    }
};

const writeIndexFile = async (icons: Icon[]) => {
    const exports = icons.map((icon) => {
        return `export { ${icon.componentName} } from "./${icon.componentName}";`;
    });

    const indexFile = await getFormattedText(exports.join("\n"));

    if (indexFile != null) {
        writeFileSync(`src/generated/index.ts`, indexFile);
    }
};

main();
