import { ButtonBase, ButtonBaseProps, Theme, WithStyles } from "@material-ui/core";
import { Clear as ClearIcon } from "@material-ui/icons";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

export interface ClearInputButtonThemeProps {
    icon?: (disabled?: boolean) => React.ReactNode;
}

export type CometAdminClearInputButtonClassKeys = "root" | "disabled" | "defaultIcon";

const styles = (theme: Theme) => {
    return createStyles<CometAdminClearInputButtonClassKeys, any>({
        root: {
            height: "100%",
            width: 32,
            flexShrink: 0,
        },
        disabled: {},
        defaultIcon: {},
    });
};

const ClearButton: React.FC<WithStyles<typeof styles, true> & ClearInputButtonThemeProps & ButtonBaseProps> = ({
    classes,
    theme,
    disabled,
    icon,
    ...otherButtonBaseProps
}) => {
    return (
        <ButtonBase classes={{ root: classes.root, disabled: classes.disabled }} disabled={disabled} tabIndex={-1} {...otherButtonBaseProps}>
            {icon ? icon(disabled) : <ClearIcon className={classes.defaultIcon} fontSize={"small"} color={disabled ? "disabled" : "action"} />}
        </ButtonBase>
    );
};

export const ClearInputButton = withStyles(styles, { name: "CometAdminClearInputButton", withTheme: true })(ClearButton);
