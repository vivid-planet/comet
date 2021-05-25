import type {} from "@comet/admin-color-picker/src/themeAugmentation";
import type {} from "@comet/admin-react-select/src/themeAugmentation";
import type {} from "@comet/admin-rte/src/themeAugmentation";
import type {} from "@comet/admin/src/themeAugmentation";
import { ThemeOptions } from "@material-ui/core/styles";

import { getAdminColorPickerOverrides } from "./AdminColorPickerOverrides/getAdminColorPickerOverrides";
import { getAdminOverrides } from "./AdminOverrides/getAdminOverrides";
import { getAdminProps } from "./AdminProps/getAdminProps";
import { getAdminRteOverrides } from "./AdminRteOverrides/getAdminRteOverrides";
import { getAdminSelectOverrides } from "./AdminSelectOverrides/getAdminSelectOverrides";
import { getMuiOverrides } from "./MuiOverrides/getMuiOverrides";
import { getMuiProps } from "./MuiProps/getMuiProps";
import { paletteOptions } from "./paletteOptions";
import { shadows } from "./shadows";
import { typographyOptions } from "./typographyOptions";

export const getThemeOptions = (): ThemeOptions => ({
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
        ...getMuiOverrides(),
        ...getAdminOverrides(),
        ...getAdminColorPickerOverrides(),
        ...getAdminRteOverrides(),
        ...getAdminSelectOverrides(),
    },
});
