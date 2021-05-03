import { CheckboxClassKey } from "@material-ui/core/Checkbox";
import { StyleRules } from "@material-ui/styles/withStyles";

import { neutrals } from "../colors";

export default (): StyleRules<{}, CheckboxClassKey> => ({
    root: {
        "&:not($checked)": {
            "& [class*='MuiSvgIcon-root']": {
                color: neutrals[100],
            },
        },
        "& [class*='MuiSvgIcon-root']": {
            fontSize: 22,
        },
    },
    checked: {},
    disabled: {},
    input: {},
    indeterminate: {},
    colorPrimary: {},
    colorSecondary: {},
});
