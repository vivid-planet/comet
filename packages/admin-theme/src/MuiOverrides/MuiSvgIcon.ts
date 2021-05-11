import { SvgIconClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

import { neutrals } from "../colors";

export const getMuiSvgIconOverrides = (): StyleRules<{}, SvgIconClassKey> => ({
    root: {
        fontSize: 16,
    },
    colorSecondary: {},
    colorAction: {},
    colorDisabled: {
        color: neutrals[200],
    },
    colorError: {},
    colorPrimary: {},
    fontSizeInherit: {},
    fontSizeSmall: {
        fontSize: 10,
    },
    fontSizeLarge: {
        fontSize: 20,
    },
});
