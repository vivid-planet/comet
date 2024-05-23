import { createTheme, Theme, ThemeOptions } from "@mui/material";
import createPalette, { PaletteOptions } from "@mui/material/styles/createPalette";
import createTypography, { TypographyOptions } from "@mui/material/styles/createTypography";
import muiDefaultZIndex from "@mui/material/styles/zIndex";
import { createBreakpoints, createSpacing } from "@mui/system";
import { BreakpointsOptions } from "@mui/system/createTheme/createBreakpoints";
import { deepmerge } from "@mui/utils";

import { breakpointsOptions as cometBreakpointsOptions } from "./breakpointsOptions";
import { getComponentsTheme } from "./componentsTheme/getComponentsTheme";
import { paletteOptions as cometPaletteOptions } from "./paletteOptions";
import { shadows } from "./shadows";
import { createTypographyOptions as createCometTypographyOptions } from "./typographyOptions";

export const createCometTheme = ({
    palette: passedPaletteOptions = {},
    typography: passedTypographyOptions = {},
    spacing: passedSpacingOptions = 5,
    components: passedComponentsOptions = {},
    zIndex: passedZIndexOptions = {},
    breakpoints: passedBreakpointsOptions = {},
    ...restPassedOptions
}: ThemeOptions | undefined = {}): Theme => {
    const breakpointsOptions: BreakpointsOptions = deepmerge<BreakpointsOptions>(cometBreakpointsOptions, passedBreakpointsOptions);
    const breakpoints = createBreakpoints(breakpointsOptions);

    const paletteOptions: PaletteOptions = deepmerge<PaletteOptions>(cometPaletteOptions, passedPaletteOptions);
    const palette = createPalette(paletteOptions);

    const passedTypographyOptionsObject: TypographyOptions =
        typeof passedTypographyOptions === "function" ? passedTypographyOptions(palette) : passedTypographyOptions;
    const typographyOptions: TypographyOptions = deepmerge<TypographyOptions>(
        createCometTypographyOptions(breakpoints),
        passedTypographyOptionsObject,
    );
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
        components: getComponentsTheme(passedComponentsOptions, { palette, typography, spacing, zIndex, shadows, breakpoints }),
        breakpoints: breakpointsOptions,
    };

    const themeOptions = deepmerge<ThemeOptions>(cometThemeOptions, restPassedOptions);
    return createTheme(themeOptions);
};
