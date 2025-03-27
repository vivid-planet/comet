import { createTheme, type Theme, type ThemeOptions } from "@mui/material";
import { createBreakpoints } from "@mui/system";
import { deepmerge } from "@mui/utils";

import { breakpointsOptions as cometBreakpointsOptions } from "./breakpointsOptions";
import { getComponentsTheme } from "./componentsTheme/getComponentsTheme";
import { paletteOptions as cometPaletteOptions } from "./paletteOptions";
import { shadows } from "./shadows";
import { createTypographyOptions } from "./typographyOptions";

export const createCometTheme = (
    {
        palette: passedPaletteOptions = {},
        typography: passedTypographyOptions = {},
        spacing: passedSpacingOptions = 5,
        components: passedComponentsOptions = {},
        zIndex: passedZIndexOptions = {},
        breakpoints: passedBreakpointsOptions = {},
        ...restPassedOptions
    }: ThemeOptions | undefined = {},
    ...args: object[]
): Theme => {
    const breakpointsOptions = deepmerge(cometBreakpointsOptions, passedBreakpointsOptions);
    const breakpoints = createBreakpoints(breakpointsOptions);

    const paletteOptions = deepmerge(cometPaletteOptions, passedPaletteOptions);
    const { palette } = createTheme({ palette: paletteOptions });

    const passedTypographyOptionsObject = typeof passedTypographyOptions === "function" ? passedTypographyOptions(palette) : passedTypographyOptions;
    const typographyOptions = deepmerge(createTypographyOptions(breakpoints), passedTypographyOptionsObject);

    const cometThemeOptionsBeforeAddingComponents = {
        spacing: passedSpacingOptions,
        palette: paletteOptions,
        typography: typographyOptions,
        shape: {
            borderRadius: 2,
        },
        mixins: {
            MuiDataGrid: {
                containerBackground: "rgb(255, 255, 255)",
            },
        },
        shadows,
        zIndex: passedZIndexOptions,
        breakpoints: breakpointsOptions,
    } satisfies ThemeOptions;

    const combinedThemeOptionsBeforeAddingComponents = deepmerge(cometThemeOptionsBeforeAddingComponents, restPassedOptions);
    const themeBeforeAddingComponents = createTheme(combinedThemeOptionsBeforeAddingComponents);

    const cometThemeOptions = {
        ...cometThemeOptionsBeforeAddingComponents,
        components: getComponentsTheme(passedComponentsOptions, themeBeforeAddingComponents),
    } satisfies ThemeOptions;

    const themeOptions = deepmerge(cometThemeOptions, restPassedOptions);
    return createTheme(themeOptions, ...args);
};
