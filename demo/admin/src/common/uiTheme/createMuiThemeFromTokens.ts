import { createDextinityTheme } from "@dextinity/admin";
import type {} from "@mui/x-data-grid/themeAugmentation";

type Rgb = [number, number, number];

function parseHexColor(hexColor: string): Rgb {
    const digits = hexColor.replace("#", "");
    const fullDigits = digits.length === 3 ? [...digits].map((digit) => digit + digit).join("") : digits.slice(0, 6);
    return [0, 2, 4].map((offset) => Number.parseInt(fullDigits.slice(offset, offset + 2), 16)) as Rgb;
}

function mixColors(from: string, to: string, weight: number) {
    const [fromRgb, toRgb] = [parseHexColor(from), parseHexColor(to)];
    return `#${fromRgb
        .map((channel, index) =>
            Math.round(channel + (toRgb[index] - channel) * weight)
                .toString(16)
                .padStart(2, "0"),
        )
        .join("")}`;
}

function lengthInPixels(length: string) {
    return length.endsWith("rem") ? Number.parseFloat(length) * 16 : Number.parseFloat(length);
}

const greySteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const greyWeights = [0.04, 0.1, 0.28, 0.45, 0.58, 0.68, 0.76, 0.84, 0.9, 0.95];
const typographyVariants = ["h1", "h2", "h3", "h4", "h5", "h6", "subtitle1", "subtitle2", "body1", "body2", "button", "caption", "overline"];

/**
 * Creates the MUI theme for the components that are still MUI from the design tokens of the @dextinity/ui theme
 * on `<html>`, so they follow the theme and its color scheme too.
 */
export function createMuiThemeFromTokens({ colorScheme, muiLocale }: { colorScheme: "light" | "dark"; muiLocale: object[] }) {
    const style = getComputedStyle(document.documentElement);
    const token = (name: string) => style.getPropertyValue(`--dextinity-${name}`).trim();

    const background = token("color-background");
    const foreground = token("color-foreground");
    const surface = token("color-surface");
    const fontFamily = token("font-family-body");
    const statusColor = (name: string) => ({
        main: token(`color-${name}`),
        light: token(`color-${name}-subtle`),
        dark: token(`color-${name}`),
        contrastText: background,
    });

    return createDextinityTheme(
        {
            palette: {
                mode: colorScheme,
                primary: {
                    main: token("color-primary"),
                    dark: token("color-primary-hover"),
                    light: token("color-primary-subtle"),
                    contrastText: token("color-primary-foreground"),
                },
                secondary: { main: foreground, light: token("color-foreground-muted"), dark: foreground, contrastText: background },
                error: statusColor("danger"),
                warning: statusColor("warning"),
                success: statusColor("success"),
                info: {
                    main: token("color-primary"),
                    light: token("color-primary-subtle"),
                    dark: token("color-primary-hover"),
                    contrastText: background,
                },
                grey: Object.fromEntries(greySteps.map((step, index) => [step, mixColors(background, foreground, greyWeights[index])])),
                common: { white: surface, black: foreground },
                divider: token("color-border"),
                text: { primary: foreground, secondary: token("color-foreground-muted"), disabled: token("color-border-strong") },
                background: { default: background, paper: surface },
                action: { active: token("color-foreground-muted"), hover: token("color-surface-hover"), selected: token("color-primary-subtle") },
                DataGrid: { bg: surface },
            },
            typography: {
                fontFamily,
                ...Object.fromEntries(typographyVariants.map((variant) => [variant, { fontFamily }])),
            },
            shape: { borderRadius: lengthInPixels(token("radius-medium")) },
        },
        ...muiLocale,
    );
}
