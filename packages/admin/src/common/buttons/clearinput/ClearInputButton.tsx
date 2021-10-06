import { Clear } from "@comet/admin-icons";
import { ButtonBase, ButtonBaseClassKey, ButtonBaseProps, WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

export type ClearInputButtonClassKey = ButtonBaseClassKey;
export interface ClearInputButtonProps extends ButtonBaseProps {
    icon?: (disabled?: boolean) => React.ReactNode;
}

const styles = () => {
    return createStyles<ClearInputButtonClassKey, ClearInputButtonProps>({
        root: {
            height: "100%",
            width: 32,
            flexShrink: 0,
        },
        disabled: {},
        focusVisible: {},
    });
};

const ClearInputBtn: React.FC<WithStyles<typeof styles> & ClearInputButtonProps> = ({ icon, disabled, ...restProps }) => {
    return (
        <ButtonBase tabIndex={-1} disabled={disabled} {...restProps}>
            {icon ? icon(disabled) : <Clear color={disabled ? "disabled" : "action"} />}
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
