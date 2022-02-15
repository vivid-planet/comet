import { Clear } from "@comet/admin-icons";
import { ButtonBase, ButtonBaseClassKey, ButtonBaseProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
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

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminClearInputButton: ClearInputButtonClassKey;
    }
}

declare module "@mui/material/styles/props" {
    interface ComponentsPropsList {
        CometAdminClearInputButton: ClearInputButtonProps;
    }
}
