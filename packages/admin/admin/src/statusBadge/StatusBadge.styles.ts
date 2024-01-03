import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { StatusBadgeProps } from "./StatusBadge";

export type StatusBadgeClassKey = "root";

export const styles = (theme: Theme) => {
    return createStyles<StatusBadgeClassKey, StatusBadgeProps>({
        root: {
            height: 16,
            width: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.palette.common.white,
            marginRight: theme.spacing(2),
            fontSize: 10,
            borderRadius: "50%",
        },
    });
};
