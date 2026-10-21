import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

import postcss, { type Rule } from "postcss";
import { describe, expect, it } from "vitest";

const sourceDirectory = join(import.meta.dirname, "..");
const themesDirectory = join(sourceDirectory, "themes");

const tokenNamePattern = /--dextinity-[a-z0-9-]+/g;

/** The documented tokens: every token in a table row of the design tokens page. */
function readContractTokens() {
    const designTokensPage = readFileSync(join(sourceDirectory, "docs", "DesignTokens.mdx"), "utf8");
    const tableRows = designTokensPage.split("\n").filter((line) => line.startsWith("| `--dextinity-"));
    return tableRows.map((row) => row.match(tokenNamePattern)?.[0] ?? "");
}

const contractTokens = readContractTokens();
const contractColorTokens = contractTokens.filter((token) => token.startsWith("--dextinity-color-"));

type ColorScheme = "light" | "dark";

interface Theme {
    fileName: string;
    name: string;
    declarations: Record<ColorScheme, Map<string, string>>;
    reducedMotionTokens: string[];
}

function readThemes(): Theme[] {
    const themeFileNames = readdirSync(themesDirectory).filter((fileName) => fileName.endsWith(".css"));

    return themeFileNames.map((fileName) => {
        const root = postcss.parse(readFileSync(join(themesDirectory, fileName), "utf8"));
        const name = basename(fileName, ".css");
        const lightSelector = `[data-dextinity-theme="${name}"]`;
        const darkSelector = `${lightSelector}[data-dextinity-color-scheme="dark"]`;

        const theme: Theme = { fileName, name, declarations: { light: new Map(), dark: new Map() }, reducedMotionTokens: [] };

        root.walkRules((rule) => {
            const isInMediaQuery = rule.parent?.type === "atrule" && "name" in rule.parent && rule.parent.name === "media";

            if (isInMediaQuery) {
                theme.reducedMotionTokens.push(...customPropertyNames(rule));
            } else if (rule.selector === lightSelector) {
                theme.declarations.light = customProperties(rule);
            } else if (rule.selector === darkSelector) {
                theme.declarations.dark = customProperties(rule);
            } else {
                throw new Error(`${fileName}: unexpected selector "${rule.selector}". A theme only styles ${lightSelector} and ${darkSelector}.`);
            }
        });

        return theme;
    });
}

function customPropertyNames(rule: Rule) {
    return [...customProperties(rule).keys()];
}

function customProperties(rule: Rule) {
    const properties = new Map<string, string>();
    rule.walkDecls((declaration) => {
        if (declaration.prop.startsWith("--")) {
            properties.set(declaration.prop, declaration.value);
        }
    });
    return properties;
}

const themes = readThemes();

/**
 * Text needs 4.5:1, control boundaries, focus rings and the checked state of a control 3:1 (WCAG 2.2, 1.4.3 and 1.4.11).
 */
const contrastRequirements = [
    ...textOn("--dextinity-color-foreground", [
        "--dextinity-color-background",
        "--dextinity-color-surface",
        "--dextinity-color-surface-hover",
        "--dextinity-color-neutral-subtle",
    ]),
    ...textOn("--dextinity-color-foreground-muted", ["--dextinity-color-background", "--dextinity-color-surface"]),
    ...textOn("--dextinity-color-primary-foreground", ["--dextinity-color-primary"]),
    ...textOn("--dextinity-color-primary", ["--dextinity-color-primary-subtle"]),
    ...textOn("--dextinity-color-success", ["--dextinity-color-background", "--dextinity-color-success-subtle"]),
    ...textOn("--dextinity-color-warning", ["--dextinity-color-background", "--dextinity-color-warning-subtle"]),
    ...textOn("--dextinity-color-danger", ["--dextinity-color-background", "--dextinity-color-surface", "--dextinity-color-danger-subtle"]),
    ...textOn("--dextinity-button-primary-foreground", ["--dextinity-button-primary-background", "--dextinity-button-primary-background-hover"]),
    ...textOn("--dextinity-button-secondary-foreground", ["--dextinity-button-secondary-background"]),
    ...textOn("--dextinity-button-secondary-foreground-hover", ["--dextinity-button-secondary-background-hover"]),
    ...textOn("--dextinity-button-ghost-foreground", ["--dextinity-color-background", "--dextinity-button-ghost-background-hover"]),
    ...nonTextOn("--dextinity-color-border-strong", ["--dextinity-color-background", "--dextinity-color-surface"]),
    ...nonTextOn("--dextinity-color-primary", ["--dextinity-color-background", "--dextinity-color-surface"]),
    ...nonTextOn("--dextinity-color-focus-ring", ["--dextinity-color-background"]),
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

describe.each(themes)("theme $fileName", (theme) => {
    it("defines every documented token, and no other, for the light color scheme", () => {
        const definedTokens = [...theme.declarations.light.keys()];

        expect({
            missingTokens: contractTokens.filter((token) => !definedTokens.includes(token)),
            undocumentedTokens: definedTokens.filter((token) => !contractTokens.includes(token)),
        }).toEqual({ missingTokens: [], undocumentedTokens: [] });
    });

    it("redefines every color token, and only documented tokens, for the dark color scheme", () => {
        const definedTokens = [...theme.declarations.dark.keys()];

        expect({
            missingTokens: contractColorTokens.filter((token) => !definedTokens.includes(token)),
            undocumentedTokens: definedTokens.filter((token) => !contractTokens.includes(token)),
        }).toEqual({ missingTokens: [], undocumentedTokens: [] });
    });

    it("turns off motion for users who prefer reduced motion", () => {
        expect(theme.reducedMotionTokens).toEqual(
            expect.arrayContaining(["--dextinity-motion-duration-short", "--dextinity-motion-duration-medium"]),
        );
    });

    describe.each<ColorScheme>(["light", "dark"])("%s color scheme", (colorScheme) => {
        it.each(contrastRequirements)("meets a contrast of $minimum:1 for $foreground on $background", ({ foreground, background, minimum }) => {
            const ratio = contrastRatio(resolveColor(theme, colorScheme, foreground), resolveColor(theme, colorScheme, background));

            expect(ratio).toBeGreaterThanOrEqual(minimum);
        });
    });
});

describe("component stylesheets", () => {
    const componentStylesheets = readdirSync(sourceDirectory, { recursive: true, encoding: "utf8" }).filter((path) => path.endsWith(".module.css"));

    it.each(componentStylesheets)("%s uses documented tokens only", (path) => {
        const usedTokens = readFileSync(join(sourceDirectory, path), "utf8").match(tokenNamePattern) ?? [];

        expect({ undocumentedTokens: usedTokens.filter((token) => !contractTokens.includes(token)) }).toEqual({ undocumentedTokens: [] });
    });
});

type Rgb = [number, number, number];

/**
 * Resolves a token to the color it shows. A gradient resolves to the color midway between its first and last
 * stop, where a button's text sits; `transparent` to the page background.
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
        const [firstStop, ...otherStops] = value.match(/#[0-9a-f]{3,6}\b/gi) ?? [];
        const lastStop = otherStops.at(-1);
        if (firstStop === undefined || lastStop === undefined) {
            throw new Error(`${theme.fileName}: ${token} must name its gradient stops as hex colors.`);
        }
        const [first, last] = [parseHexColor(firstStop), parseHexColor(lastStop)];
        return [0, 1, 2].map((channel) => (first[channel] + last[channel]) / 2) as Rgb;
    }

    if (value.startsWith("#")) {
        return parseHexColor(value);
    }

    throw new Error(`${theme.fileName}: ${token} is "${value}". Use a hex color, so its contrast can be checked.`);
}

function parseHexColor(hexColor: string): Rgb {
    const digits = hexColor.slice(1);
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
