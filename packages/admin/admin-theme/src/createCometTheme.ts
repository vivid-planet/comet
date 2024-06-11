import { createTheme, Theme, ThemeOptions } from "@mui/material";
import createPalette, { PaletteOptions } from "@mui/material/styles/createPalette";
import createTypography, { TypographyOptions } from "@mui/material/styles/createTypography";
import muiDefaultZIndex from "@mui/material/styles/zIndex";
import { createSpacing } from "@mui/system";
import { deepmerge } from "@mui/utils";

import { getComponentsTheme } from "./componentsTheme/getComponentsTheme";
import { paletteOptions as cometPaletteOptions } from "./paletteOptions";
import { shadows } from "./shadows";
import { typographyOptions as cometTypographyOptions } from "./typographyOptions";

export const createCometTheme = (
    {
        palette: passedPaletteOptions = {},
        typography: passedTypographyOptions = {},
        spacing: passedSpacingOptions = 5,
        components: passedComponentsOptions = {},
        zIndex: passedZIndexOptions = {},
        ...restPassedOptions
    }: ThemeOptions | undefined = {},
    ...args: object[]
): Theme => {
    const paletteOptions: PaletteOptions = deepmerge<PaletteOptions>(cometPaletteOptions, passedPaletteOptions);
    const palette = createPalette(paletteOptions);

    const passedTypographyOptionsObject: TypographyOptions =
        typeof passedTypographyOptions === "function" ? passedTypographyOptions(palette) : passedTypographyOptions;
    const typographyOptions: TypographyOptions = deepmerge<TypographyOptions>(cometTypographyOptions, passedTypographyOptionsObject);
    const typography = createTypography(palette, typographyOptions);

    const spacing = createSpacing(passedSpacingOptions);

    const zIndex = {
        ...muiDefaultZIndex,
        ...passedZIndexOptions,
    };

    const cometThemeOptions: ThemeOptions = {
        spacing: passedSpacingOptions,
        palette: paletteOptions,
        typography: typographyOptions,
        shape: {
            borderRadius: 2,
        },
        shadows,
        zIndex,
        components: getComponentsTheme(passedComponentsOptions, { palette, typography, spacing, zIndex, shadows }),
    };

    const themeOptions = deepmerge<ThemeOptions>(cometThemeOptions, restPassedOptions);
    return createTheme(themeOptions, ...args);
};
