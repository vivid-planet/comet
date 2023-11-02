import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { TabProps } from "./CustomTab";

export type TabClassKey = "root" | "status" | "icon" | "tooltip" | "label";

export const styles = (theme: Theme) => {
    return createStyles<TabClassKey, TabProps>({
        root: {
            minHeight: 51,
            padding: theme.spacing(4, 2),
        },
        status: {
            height: 16,
            width: 16,
            marginRight: theme.spacing(2),
            borderRadius: "50%",
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
