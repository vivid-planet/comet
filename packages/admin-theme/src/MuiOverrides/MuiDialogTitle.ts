import { DialogTitleClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

import { darkPalette } from "../colors";
import { fontWeights } from "../typographyOptions";

export const getMuiDialogTitleOverrides = (): StyleRules<{}, DialogTitleClassKey> => ({
    root: {
        backgroundColor: darkPalette.light,
        color: darkPalette.contrastText,
        padding: 20,
        "& [class*='MuiTypography-root']": {
            fontSize: 14,
            lineHeight: "20px",
            fontWeight: fontWeights.fontWeightBold,
        },
    },
});
