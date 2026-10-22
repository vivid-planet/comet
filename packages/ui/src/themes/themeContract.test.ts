// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

import postcss, { type Rule } from "postcss";
import { describe, expect, it } from "vitest";

import { iconNames } from "../icon/iconNames";
import { themeOptions } from "../storybook/themeDecorator";
import { readTokenTableRows, tokenNamePattern } from "../storybook/tokenTables";

const sourceDirectory = join(import.meta.dirname, "..");
const themesDirectory = join(sourceDirectory, "themes");

/** The tokens of each table row of a documentation page. */
function readPageTokenRows(pagePath: string) {
    return readTokenTableRows(readFileSync(pagePath, "utf8")).map((row) => row.tokens);
}

/** The documented tokens: the token in each table row of the design tokens page. */
function readContractTokens() {
    return readPageTokenRows(join(sourceDirectory, "docs", "DesignTokens.mdx")).map((rowTokens) => (rowTokens.length === 1 ? rowTokens[0] : ""));
}

const contractTokens = readContractTokens();
const iconTokens: string[] = iconNames.map((iconName) => `--dextinity-icon-${iconName}`);
const contractColorTokens = contractTokens.filter((token) => token.startsWith("--dextinity-color-"));

type ColorScheme = "light" | "dark";

interface Theme {
    fileName: string;
    name: string;
    declarations: Record<ColorScheme, Map<string, string>>;
    reducedMotionDeclarations: Map<string, string>;
    reducedMotionSelectors: string[];
    /** Where the dark color scheme's rule and the reduced-motion rule start in the file, to check their order. */
    darkRuleOffset: number;
    reducedMotionRuleOffset: number;
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function readThemes(): Theme[] {
    const themeFileNames = readdirSync(themesDirectory).filter((fileName) => fileName.endsWith(".css"));

    return themeFileNames.map((fileName) => {
        const root = postcss.parse(readFileSync(join(themesDirectory, fileName), "utf8"));
        const name = basename(fileName, ".css");
        const lightSelector = `[data-dextinity-theme="${name}"]`;
        const darkSelector = `${lightSelector}[data-dextinity-color-scheme="dark"]`;

        const theme: Theme = {
            fileName,
            name,
            declarations: { light: new Map(), dark: new Map() },
            reducedMotionDeclarations: new Map(),
            reducedMotionSelectors: [],
            darkRuleOffset: -1,
            reducedMotionRuleOffset: -1,
        };

        root.walkRules((rule) => {
            const selectors = rule.selectors;
            const isThemeRule = selectors.every((selector) => selector === lightSelector || selector === darkSelector);
            if (!isThemeRule) {
                throw new Error(`${fileName}: unexpected selector "${rule.selector}". A theme only styles ${lightSelector} and ${darkSelector}.`);
            }

            const atRules = enclosingAtRules(rule);
            if (atRules[0] !== "layer dextinity") {
                throw new Error(`${fileName}: "${rule.selector}" must be inside @layer dextinity.`);
            }
            if (atRules.length > 2 || (atRules.length === 2 && atRules[1] !== `media ${reducedMotionQuery}`)) {
                throw new Error(`${fileName}: unexpected at-rule around "${rule.selector}". A theme only uses @media ${reducedMotionQuery}.`);
            }

            const ruleOffset = rule.source?.start?.offset ?? -1;
            if (atRules.length === 2) {
                addCustomProperties(theme.reducedMotionDeclarations, rule);
                theme.reducedMotionSelectors.push(...selectors);
                theme.reducedMotionRuleOffset = ruleOffset;
            } else if (rule.selector === lightSelector) {
                addCustomProperties(theme.declarations.light, rule);
            } else if (rule.selector === darkSelector) {
                addCustomProperties(theme.declarations.dark, rule);
                theme.darkRuleOffset = ruleOffset;
            } else {
                throw new Error(`${fileName}: define the light and the dark color scheme in separate rules, not in "${rule.selector}".`);
            }
        });

        return theme;
    });
}

/** The at-rules around a rule, outermost first, as "<name> <params>". */
function enclosingAtRules(rule: Rule) {
    const atRules: string[] = [];
    for (let node = rule.parent; node && node.type !== "root"; node = node.parent) {
        if (node.type === "atrule" && "name" in node) {
            atRules.unshift(`${node.name} ${node.params}`);
        }
    }
    return atRules;
}

function addCustomProperties(properties: Map<string, string>, rule: Rule) {
    rule.walkDecls((declaration) => {
        if (declaration.prop.startsWith("--")) {
            properties.set(declaration.prop, declaration.value);
        }
    });
}

const themes = readThemes();

const subtleBackgrounds = [
    "--dextinity-color-neutral-subtle",
    "--dextinity-color-primary-subtle",
    "--dextinity-color-success-subtle",
    "--dextinity-color-warning-subtle",
    "--dextinity-color-danger-subtle",
];

/**
 * Text needs 4.5:1, control boundaries, focus rings and the checked state of a control 3:1 (WCAG 2.2, 1.4.3 and 1.4.11).
 * Secondary and ghost buttons may show the background behind them, so their text needs it on the subtle backgrounds
 * too, for a button in an alert.
 */
const contrastRequirements = [
    ...textOn("--dextinity-color-foreground", [
        "--dextinity-color-background",
        "--dextinity-color-surface",
        "--dextinity-color-surface-hover",
        ...subtleBackgrounds,
    ]),
    ...textOn("--dextinity-color-foreground-muted", ["--dextinity-color-background", "--dextinity-color-surface"]),
    ...textOn("--dextinity-color-primary-foreground", ["--dextinity-color-primary"]),
    ...textOn("--dextinity-color-primary", ["--dextinity-color-primary-subtle"]),
    ...textOn("--dextinity-color-success", ["--dextinity-color-background", "--dextinity-color-success-subtle"]),
    ...textOn("--dextinity-color-warning", ["--dextinity-color-background", "--dextinity-color-warning-subtle"]),
    ...textOn("--dextinity-color-danger", ["--dextinity-color-background", "--dextinity-color-surface", "--dextinity-color-danger-subtle"]),
    ...textOn("--dextinity-button-primary-foreground", ["--dextinity-button-primary-background", "--dextinity-button-primary-background-hover"]),
    ...textOn("--dextinity-button-secondary-foreground", ["--dextinity-button-secondary-background", ...subtleBackgrounds]),
    ...textOn("--dextinity-button-secondary-foreground-hover", ["--dextinity-button-secondary-background-hover"]),
    ...textOn("--dextinity-button-ghost-foreground", [
        "--dextinity-color-background",
        "--dextinity-button-ghost-background-hover",
        ...subtleBackgrounds,
    ]),
    ...textOn("--dextinity-app-bar-foreground", ["--dextinity-app-bar-background", "--dextinity-app-bar-background-hover"]),
    ...nonTextOn("--dextinity-color-border-strong", ["--dextinity-color-background", "--dextinity-color-surface"]),
    ...nonTextOn("--dextinity-color-border-hover", ["--dextinity-color-background", "--dextinity-color-surface"]),
    ...nonTextOn("--dextinity-color-primary", ["--dextinity-color-background", "--dextinity-color-surface"]),
    ...nonTextOn("--dextinity-color-primary-hover", ["--dextinity-color-background", "--dextinity-color-surface"]),
    ...nonTextOn("--dextinity-color-primary-foreground", ["--dextinity-color-primary-hover"]),
    ...nonTextOn("--dextinity-color-focus-ring", ["--dextinity-color-background"]),
    ...nonTextOn("--dextinity-app-bar-focus-ring", ["--dextinity-app-bar-background"]),
];

function textOn(foreground: string, backgrounds: string[]) {
    return backgrounds.map((background) => ({ foreground, background, minimum: 4.5 }));
}

function nonTextOn(foreground: string, backgrounds: string[]) {
    return backgrounds.map((background) => ({ foreground, background, minimum: 3 }));
}

describe("design tokens page", () => {
    it("documents each token once", () => {
        expect(contractTokens).not.toContain("");
        expect(new Set(contractTokens).size).toBe(contractTokens.length);
    });
});

describe("list of themes", () => {
    const packageDirectory = join(sourceDirectory, "..");
    const themeNames = themes.map((theme) => theme.name).sort();
    const listedThemes = readListedThemes();

    /** The rows of the table under "Available themes" on the theming page: the theme's name and whether it's published. */
    function readListedThemes() {
        const theming = readFileSync(join(sourceDirectory, "docs", "Theming.mdx"), "utf8");
        const section = theming.split("## Available themes")[1]?.split("\n## ")[0] ?? "";
        return section
            .split("\n")
            .filter((line) => line.startsWith("| ") && !line.startsWith("| Theme") && !line.startsWith("| ---"))
            .map((line) => {
                const [, , attributeCell = "", stylesheetCell = ""] = line.split("|");
                const name = attributeCell.trim().replaceAll("`", "");
                return { name, isPublished: stylesheetCell.includes(`\`@dextinity/ui/themes/${name}.css\``) };
            });
    }

    it("lists every theme in Theming.mdx", () => {
        expect(listedThemes.map((theme) => theme.name).sort()).toEqual(themeNames);
    });

    it("offers every theme in the Storybook toolbar", () => {
        expect(themeOptions.map((option) => option.value).sort()).toEqual(themeNames);
    });

    it("publishes exactly the themes Theming.mdx names as published", () => {
        const viteConfig = readFileSync(join(packageDirectory, "vite.config.mts"), "utf8");
        const builtThemes = JSON.parse(viteConfig.match(/const publishedThemes = (\[[^\]]*\]);/)?.[1] ?? "null");
        const { exports } = JSON.parse(readFileSync(join(packageDirectory, "package.json"), "utf8"));
        const exportedThemes = Object.keys(exports)
            .map((path) => path.match(/^\.\/themes\/([a-z-]+)\.css$/)?.[1])
            .filter((name) => name !== undefined);
        const publishedThemes = listedThemes.filter((theme) => theme.isPublished).map((theme) => theme.name);

        expect({ builtThemes, exportedThemes }).toEqual({ builtThemes: publishedThemes, exportedThemes: publishedThemes });
    });
});

describe.each(themes)("theme $fileName", (theme) => {
    it("defines every documented token, and no other, for the light color scheme", () => {
        const definedTokens = [...theme.declarations.light.keys()];

        expect({
            missingTokens: contractTokens.filter((token) => !definedTokens.includes(token)),
            undocumentedTokens: definedTokens.filter((token) => !contractTokens.includes(token) && !iconTokens.includes(token)),
        }).toEqual({ missingTokens: [], undocumentedTokens: [] });
    });

    it("replaces only icons of the icon set, each with an image", () => {
        const themeIconTokens = [...theme.declarations.light, ...theme.declarations.dark].filter(([token]) => token.startsWith("--dextinity-icon-"));

        expect({
            unknownIcons: themeIconTokens.map(([token]) => token).filter((token) => !iconTokens.includes(token)),
            iconsThatArentImages: themeIconTokens.filter(([, value]) => !value.startsWith("url(")).map(([token]) => token),
        }).toEqual({ unknownIcons: [], iconsThatArentImages: [] });
    });

    it("redefines every color token, and only documented tokens, for the dark color scheme", () => {
        const definedTokens = [...theme.declarations.dark.keys()];

        expect({
            missingTokens: contractColorTokens.filter((token) => !definedTokens.includes(token)),
            undocumentedTokens: definedTokens.filter((token) => !contractTokens.includes(token) && !iconTokens.includes(token)),
        }).toEqual({ missingTokens: [], undocumentedTokens: [] });
    });

    it("turns off motion for users who prefer reduced motion", () => {
        expect(Object.fromEntries(theme.reducedMotionDeclarations)).toEqual({
            "--dextinity-motion-duration-short": "0s",
            "--dextinity-motion-duration-medium": "0s",
        });
        // Covering the dark selector after the dark rule wins over durations the dark color scheme redefines.
        expect(theme.reducedMotionSelectors).toEqual([
            `[data-dextinity-theme="${theme.name}"]`,
            `[data-dextinity-theme="${theme.name}"][data-dextinity-color-scheme="dark"]`,
        ]);
        expect(theme.reducedMotionRuleOffset).toBeGreaterThan(theme.darkRuleOffset);
    });

    it("uses unitless line heights, which the components multiply with font sizes", () => {
        const lineHeights = [...theme.declarations.light, ...theme.declarations.dark].filter(([token]) => token.endsWith("-line-height"));

        expect(lineHeights.filter(([, value]) => !/^\d+(\.\d+)?$/.test(value))).toEqual([]);
    });

    describe.each<ColorScheme>(["light", "dark"])("%s color scheme", (colorScheme) => {
        it.each(contrastRequirements)("meets a contrast of $minimum:1 for $foreground on $background", ({ foreground, background, minimum }) => {
            const ratio = contrastRatio(resolveColor(theme, colorScheme, foreground), resolveColor(theme, colorScheme, background));

            expect(ratio).toBeGreaterThanOrEqual(minimum);
        });
    });
});

describe("icon set", () => {
    const iconDirectory = join(sourceDirectory, "icon");

    it("has an SVG file for every icon name, and no other", () => {
        const svgNames = readdirSync(join(iconDirectory, "svg")).map((fileName) => basename(fileName, ".svg"));

        expect(svgNames.sort()).toEqual([...iconNames].sort());
    });

    it("defines every icon's token in icons.css, from its SVG file", () => {
        const defaults = new Map<string, string>();
        postcss.parse(readFileSync(join(iconDirectory, "icons.css"), "utf8")).walkDecls((declaration) => {
            defaults.set(declaration.prop, declaration.value);
        });

        expect(Object.fromEntries(defaults)).toEqual(
            Object.fromEntries(iconNames.map((iconName) => [`--dextinity-icon-${iconName}`, `url("./svg/${iconName}.svg")`])),
        );
    });
});

describe("component stylesheets", () => {
    const componentStylesheets = readdirSync(sourceDirectory, { recursive: true, encoding: "utf8" }).filter((path) => path.endsWith(".module.css"));

    it.each(componentStylesheets)("%s uses documented tokens only", (path) => {
        const usedTokens = readFileSync(join(sourceDirectory, path), "utf8").match(tokenNamePattern) ?? [];

        expect({ undocumentedTokens: usedTokens.filter((token) => !contractTokens.includes(token)) }).toEqual({ undocumentedTokens: [] });
    });
});

describe("component docs pages", () => {
    const isComponentStylesheet = (fileName: string) => /^[A-Z][A-Za-z0-9]*\.module\.css$/.test(fileName);
    const isComponentModule = (fileName: string) => /^[A-Z][A-Za-z0-9]*\.tsx$/.test(fileName);
    // TODO remove the *DesignTokens.mdx pages once every component has its docs page.
    const isDocsPage = (fileName: string) => fileName.endsWith(".mdx");
    const storiesFileNames = (folder: string) => {
        const storiesDirectory = join(sourceDirectory, folder, "__stories__");
        return existsSync(storiesDirectory) ? readdirSync(storiesDirectory) : [];
    };
    const folderFileNames = (folder: string) => readdirSync(join(sourceDirectory, folder));
    const readFolderFile = (folder: string, fileName: string) => readFileSync(join(sourceDirectory, folder, fileName), "utf8");
    // A folder with a page but no stylesheet is checked too, so a page can't outlive its stylesheet.
    const componentFolders = readdirSync(sourceDirectory, { withFileTypes: true })
        .filter(
            (entry) =>
                entry.isDirectory() && (folderFileNames(entry.name).some(isComponentStylesheet) || storiesFileNames(entry.name).some(isDocsPage)),
        )
        .map((entry) => entry.name);

    function docsPageOf(folder: string) {
        const pageFileNames = storiesFileNames(folder).filter(isDocsPage);
        expect(pageFileNames, `${folder}/__stories__ needs one docs page, <Component>.mdx`).toHaveLength(1);
        return readFolderFile(join(folder, "__stories__"), pageFileNames[0]);
    }

    /** The part of a page under one of its `##` headings. */
    function section(page: string, heading: string) {
        return page.split(`\n## ${heading}\n`)[1]?.split("\n## ")[0] ?? "";
    }

    it.each(componentFolders)("%s lists each token its stylesheets use exactly once", (folder) => {
        const page = docsPageOf(folder);
        const tokenSection = page.includes("\n## Design tokens\n") ? section(page, "Design tokens") : page;
        const usedTokens = new Set(
            folderFileNames(folder)
                .filter(isComponentStylesheet)
                .flatMap((fileName) => readFolderFile(folder, fileName).match(tokenNamePattern) ?? []),
        );
        const listedTokens = readTokenTableRows(tokenSection).flatMap((row) => row.tokens);

        expect({
            missingTokens: [...usedTokens].filter((token) => !listedTokens.includes(token)),
            unusedTokens: listedTokens.filter((token) => !usedTokens.has(token)),
            repeatedTokens: listedTokens.filter((token, index) => listedTokens.indexOf(token) !== index),
        }).toEqual({ missingTokens: [], unusedTokens: [], repeatedTokens: [] });
    });

    it.each(
        componentFolders.filter((folder) =>
            storiesFileNames(folder).some((fileName) => isDocsPage(fileName) && !fileName.endsWith("DesignTokens.mdx")),
        ),
    )("%s documents each of its slots", (folder) => {
        const slotNames = folderFileNames(folder)
            .filter(isComponentModule)
            .flatMap((fileName) => [...readFolderFile(folder, fileName).matchAll(/export interface \w+SlotProps \{([\s\S]*?)\n\}/g)])
            .flatMap(([, body]) => [...body.matchAll(/^ {4}(\w+)\?:/gm)].map(([, slotName]) => slotName));
        const documentedSlots = section(docsPageOf(folder), "Slots")
            .split("\n")
            .map((line) => line.match(/^\| `(\w+)`/)?.[1])
            .filter((slotName) => slotName !== undefined);

        expect({ undocumentedSlots: [...new Set(slotNames)].filter((slotName) => !documentedSlots.includes(slotName)) }).toEqual({
            undocumentedSlots: [],
        });
    });
});

type Rgb = [number, number, number];

/**
 * Resolves a token to the color it shows. A gradient of two colors resolves to the color midway between them,
 * where a button's text sits; `transparent` to the page background.
 */
function resolveColor(theme: Theme, colorScheme: ColorScheme, token: string): Rgb {
    const value = theme.declarations[colorScheme].get(token) ?? theme.declarations.light.get(token);

    if (value === undefined) {
        throw new Error(`${theme.fileName}: ${token} is not defined.`);
    }

    const reference = value.match(/^var\((--dextinity-[a-z0-9-]+)\)$/)?.[1];
    if (reference !== undefined) {
        return resolveColor(theme, colorScheme, reference);
    }

    if (value === "transparent") {
        return resolveColor(theme, colorScheme, "--dextinity-color-background");
    }

    if (value.startsWith("linear-gradient(")) {
        const stops = gradientColorStops(value);
        if (stops.length !== 2) {
            throw new Error(`${theme.fileName}: ${token} must be a gradient of two hex colors, so its contrast can be checked.`);
        }
        const [first, last] = stops.map((stop) => parseHexColor(stop, `${theme.fileName}: ${token}`));
        return [0, 1, 2].map((channel) => (first[channel] + last[channel]) / 2) as Rgb;
    }

    if (value.startsWith("#")) {
        return parseHexColor(value, `${theme.fileName}: ${token}`);
    }

    throw new Error(`${theme.fileName}: ${token} is "${value}". Use a hex color, so its contrast can be checked.`);
}

/** The hex colors of a gradient's color stops, or an empty list if any stop isn't a hex color with optional positions. */
function gradientColorStops(gradient: string) {
    const gradientArguments = splitTopLevelCommas(gradient.slice("linear-gradient(".length, -1)).map((argument) => argument.trim());
    const hasDirection = /^(-?[\d.]+(deg|grad|rad|turn)|to |in )/.test(gradientArguments[0] ?? "");
    const colorStops = hasDirection ? gradientArguments.slice(1) : gradientArguments;
    const hexColors = colorStops.map((colorStop) => colorStop.match(/^(#[0-9a-f]+)(\s+-?[\d.]+%){0,2}$/i)?.[1]);
    return hexColors.every((hexColor) => hexColor !== undefined) ? hexColors : [];
}

function splitTopLevelCommas(text: string) {
    const parts = [""];
    let depth = 0;
    for (const character of text) {
        if (character === "," && depth === 0) {
            parts.push("");
            continue;
        }
        depth += character === "(" ? 1 : character === ")" ? -1 : 0;
        parts[parts.length - 1] += character;
    }
    return parts;
}

function parseHexColor(hexColor: string, origin: string): Rgb {
    const digits = hexColor.slice(1);
    if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(digits)) {
        throw new Error(`${origin} uses "${hexColor}". Use an opaque hex color with 3 or 6 digits, so its contrast can be checked.`);
    }
    const fullDigits = digits.length === 3 ? [...digits].map((digit) => digit + digit).join("") : digits;
    return [0, 2, 4].map((offset) => Number.parseInt(fullDigits.slice(offset, offset + 2), 16)) as Rgb;
}

function relativeLuminance(color: Rgb) {
    const [red, green, blue] = color.map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: Rgb, second: Rgb) {
    const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
    return (lighter + 0.05) / (darker + 0.05);
}
