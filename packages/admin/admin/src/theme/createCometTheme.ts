import { createTheme, type Theme, type ThemeOptions } from "@mui/material";
import { createBreakpoints } from "@mui/system";
import { deepmerge } from "@mui/utils";
import { type IntlShape } from "react-intl";

import { breakpointsOptions as cometBreakpointsOptions } from "./breakpointsOptions";
import { getComponentsTheme } from "./componentsTheme/getComponentsTheme";
import { paletteOptions as cometPaletteOptions } from "./paletteOptions";
import { shadows } from "./shadows";
import { createTypographyOptions } from "./typographyOptions";

type AdditionalOptions = {
    /**
     * Additional argument that will be passed to MUI's `createTheme` function.
     */
    themeArgs?: object[];
    intl: IntlShape;
};

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
    { intl, themeArgs = [] }: AdditionalOptions,
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
        components: getComponentsTheme(passedComponentsOptions, themeBeforeAddingComponents, intl),
    } satisfies ThemeOptions;

    const themeOptions = deepmerge(cometThemeOptions, restPassedOptions);
    return createTheme(themeOptions, ...themeArgs);
};
