import type {} from "@comet/admin-color-picker/src/themeAugmentation";
import type {} from "@comet/admin-react-select/src/themeAugmentation";
import type {} from "@comet/admin-rte/src/themeAugmentation";
import type {} from "@comet/admin/src/themeAugmentation";
import { ThemeOptions } from "@material-ui/core/styles";

import { getCometAdminColorPickerOverrides } from "./CometAdminColorPickerOverrides/getCometAdminColorPickerOverrides";
import { getCometAdminOverrides } from "./CometAdminOverrides/getCometAdminOverrides";
import { getCometAdminProps } from "./CometAdminProps/getCometAdminProps";
import { getCometAdminRteOverrides } from "./CometAdminRteOverrides/getCometAdminRteOverrides";
import { getCometAdminSelectOverrides } from "./CometAdminSelectOverrides/getCometAdminSelectOverrides";
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
        ...getCometAdminProps(),
    },
    overrides: {
        ...getMuiOverrides(),
        ...getCometAdminOverrides(),
        ...getCometAdminColorPickerOverrides(),
        ...getCometAdminRteOverrides(),
        ...getCometAdminSelectOverrides(),
    },
});
