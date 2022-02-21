import { createTheme, Theme, ThemeOptions } from "@mui/material";
import { Palette, PaletteOptions } from "@mui/material/styles";
import createPalette from "@mui/material/styles/createPalette";
import createTypography, { Typography, TypographyOptions } from "@mui/material/styles/createTypography";
import { createSpacing, Spacing, SpacingOptions } from "@mui/system";
import merge from "lodash.merge";

import { getComponentsTheme } from "./componentsTheme/getComponentsTheme";
import { paletteOptions as cometPaletteOptions } from "./paletteOptions";
import { shadows } from "./shadows";
import { typographyOptions as cometTypographyOptions } from "./typographyOptions";

export const createCometTheme = (customThemeOptions: ThemeOptions | undefined = {}): Theme => {
    const customPaletteOptions: PaletteOptions = customThemeOptions?.palette ? customThemeOptions.palette : {};
    const paletteOptions: PaletteOptions = merge(cometPaletteOptions, customPaletteOptions);
    const palette: Palette = createPalette(paletteOptions);

    const customTypographyOptions: TypographyOptions | ((palette: Palette) => TypographyOptions) = customThemeOptions?.typography
        ? customThemeOptions.typography
        : {};
    const customTypographyOptionsObject: TypographyOptions =
        typeof customTypographyOptions === "function" ? customTypographyOptions(palette) : customTypographyOptions;
    const typographyOptions: TypographyOptions = merge(cometTypographyOptions, customTypographyOptionsObject);
    const typography: Typography = createTypography(palette, typographyOptions);

    const spacingOptions: SpacingOptions = customThemeOptions?.spacing === undefined ? 5 : customThemeOptions.spacing;
    const spacing: Spacing = createSpacing(spacingOptions);

    const cometThemeOptions: ThemeOptions = {
        spacing: spacingOptions,
        palette: paletteOptions,
        typography: typographyOptions,
        shape: {
            borderRadius: 2,
        },
        shadows,
        components: getComponentsTheme(palette, typography, spacing),
    };

    const themeOptions: ThemeOptions = merge(cometThemeOptions, customThemeOptions);
    return createTheme(themeOptions);
};
