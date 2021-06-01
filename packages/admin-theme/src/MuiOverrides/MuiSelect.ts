import { SelectClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

import { neutrals } from "../colors";

export const getMuiSelectOverrides = (): StyleRules<{}, SelectClassKey> => ({
    root: {},
    select: {
        minWidth: 160,
    },
    filled: {},
    outlined: {},
    selectMenu: {},
    disabled: {},
    icon: {
        top: "calc(50% - 6px)",
        right: 12,
        fontSize: 12,
        color: neutrals[900],
    },
    iconOpen: {},
    iconFilled: {},
    iconOutlined: {},
});
