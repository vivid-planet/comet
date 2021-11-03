import { ButtonBaseClassKey } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { createStyles } from "@material-ui/styles";

import { AppHeaderButtonProps } from "./AppHeaderButton";

export type AppHeaderButtonClassKey = ButtonBaseClassKey | "inner" | "startIcon" | "endIcon" | "typography";

export const styles = ({ spacing }: Theme) => {
    return createStyles<AppHeaderButtonClassKey, AppHeaderButtonProps>({
        root: {
            height: "100%",
            borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
        },
        inner: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minWidth: "var(--header-height)",
            boxSizing: "border-box",
            paddingLeft: spacing(4),
            paddingRight: spacing(4),
        },
        disabled: {},
        focusVisible: {},
        startIcon: {
            display: "flex",
            alignItems: "center",
            "&:not(:last-child)": {
                marginRight: spacing(2),
            },
        },
        endIcon: {
            display: "flex",
            alignItems: "center",
            "&:not(:first-child)": {
                marginLeft: spacing(2),
            },
        },
        typography: {},
    });
};
