import type {} from "@comet/admin-color-picker/src/themeAugmentation";
import type {} from "@comet/admin-react-select/src/themeAugmentation";
import type {} from "@comet/admin-rte/src/themeAugmentation";
import type {} from "@comet/admin/src/themeAugmentation";
import { createMuiTheme, Theme } from "@material-ui/core";
import { ThemeOptions } from "@material-ui/core/styles";
import createPalette, { Palette, PaletteOptions } from "@material-ui/core/styles/createPalette";
import createSpacing, { Spacing, SpacingOptions } from "@material-ui/core/styles/createSpacing";
import createTypography, { Typography, TypographyOptions } from "@material-ui/core/styles/createTypography";
import type {} from "@material-ui/lab/themeAugmentation";
import merge from "lodash.merge";

import { getMuiOverrides } from "./MuiOverrides/getMuiOverrides";
import { getMuiProps } from "./MuiProps/getMuiProps";
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

    const cometThemeOptions = {
        spacing: spacingOptions,
        palette: paletteOptions,
        typography: typographyOptions,
        shape: {
            borderRadius: 2,
        },
        shadows,
        props: {
            ...getMuiProps(),
        },
        overrides: {
            ...getMuiOverrides(palette, typography, spacing),
        },
    };

    const themeOptions: ThemeOptions = merge(cometThemeOptions, customThemeOptions);
    return createMuiTheme(themeOptions);
};
