import { Clear } from "@comet/admin-icons";
import { ButtonBase, ButtonBaseClassKey, ButtonBaseProps, WithStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

export type ClearInputButtonClassKey = ButtonBaseClassKey;
export interface ClearInputButtonProps extends ButtonBaseProps {
    icon?: React.ReactNode;
}

const styles = ({ palette }: Theme) => {
    return createStyles<ClearInputButtonClassKey, ClearInputButtonProps>({
        root: {
            height: "100%",
            width: 40,
            color: palette.action.active,
        },
        disabled: {
            color: palette.action.disabled,
        },
        focusVisible: {},
    });
};

const ClearInputBtn: React.FC<WithStyles<typeof styles> & ClearInputButtonProps> = ({ icon = <Clear />, ...restProps }) => {
    return (
        <ButtonBase tabIndex={-1} {...restProps}>
            {icon}
        </ButtonBase>
    );
};

export const ClearInputButton = withStyles(styles, { name: "CometAdminClearInputButton" })(ClearInputBtn);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminClearInputButton: ClearInputButtonClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminClearInputButton: ClearInputButtonProps;
    }
}
