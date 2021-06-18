import type {} from "@comet/admin-color-picker/src/themeAugmentation";
import type {} from "@comet/admin-react-select/src/themeAugmentation";
import type {} from "@comet/admin-rte/src/themeAugmentation";
import type {} from "@comet/admin/src/themeAugmentation";
import { createMuiTheme, Theme } from "@material-ui/core";
import { ThemeOptions } from "@material-ui/core/styles";
import createPalette, { Palette, PaletteOptions } from "@material-ui/core/styles/createPalette";
import createTypography, { Typography, TypographyOptions } from "@material-ui/core/styles/createTypography";
import merge from "lodash.merge";

import { getAdminColorPickerOverrides } from "./AdminColorPickerOverrides/getAdminColorPickerOverrides";
import { getAdminOverrides } from "./AdminOverrides/getAdminOverrides";
import { getAdminProps } from "./AdminProps/getAdminProps";
import { getAdminRteOverrides } from "./AdminRteOverrides/getAdminRteOverrides";
import { getAdminSelectOverrides } from "./AdminSelectOverrides/getAdminSelectOverrides";
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

    const cometThemeOptions = {
        spacing: 5,
        palette: paletteOptions,
        typography: typographyOptions,
        shape: {
            borderRadius: 2,
        },
        shadows,
        props: {
            ...getMuiProps(),
            ...getAdminProps(),
        },
        overrides: {
            ...getMuiOverrides(palette, typography),
            ...getAdminOverrides(palette),
            ...getAdminColorPickerOverrides(),
            ...getAdminRteOverrides(),
            ...getAdminSelectOverrides(),
        },
    };

    const themeOptions: ThemeOptions = merge(cometThemeOptions, customThemeOptions);
    return createMuiTheme(themeOptions);
};
