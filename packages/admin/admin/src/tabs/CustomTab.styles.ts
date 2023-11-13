import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { TabProps } from "./CustomTab";

export type TabClassKey = "root" | "status" | "icon" | "tooltip" | "label";

export const styles = (theme: Theme) => {
    return createStyles<TabClassKey, TabProps>({
        root: {
            minHeight: 51,
            padding: theme.spacing(4, 2),
            "&.Mui-disabled": {
                color: `${theme.palette.grey[200]} !important`,
            },
        },
        status: {
            height: 16,
            width: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.palette.common.white,
            marginRight: theme.spacing(2),
            fontSize: 12,
            borderRadius: "50%",
            opacity: ({ disabled }) => (disabled ? 0.5 : 1),
        },
        icon: {
            display: "flex",
            alignItems: "center",
            marginRight: theme.spacing(2),
        },
        tooltip: {},
        label: {
            textTransform: ({ smallTabText }) => (smallTabText ? "capitalize" : "uppercase"),
        },
    });
};
