import { Clear } from "@comet/admin-icons";
import { ButtonBase, ButtonBaseClassKey, ButtonBaseProps, ComponentsOverrides, inputAdornmentClasses, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

export type ClearInputButtonClassKey = ButtonBaseClassKey;
export interface ClearInputButtonProps extends ButtonBaseProps {
    icon?: React.ReactNode;
}

const styles = ({ palette, spacing }: Theme) => {
    return createStyles<ClearInputButtonClassKey, ClearInputButtonProps>({
        root: {
            height: "100%",
            width: 40,
            color: palette.action.active,

            [`.${inputAdornmentClasses.positionEnd}:last-child &`]: {
                marginRight: spacing(-2),
            },

            [`.${inputAdornmentClasses.positionStart}:first-child &`]: {
                marginLeft: spacing(-2),
            },
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

/**
 * @deprecated Use `ClearInputAdornment` directly as the InputAdornment instead
 */
export const ClearInputButton = withStyles(styles, { name: "CometAdminClearInputButton" })(ClearInputBtn);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminClearInputButton: ClearInputButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminClearInputButton: Partial<ClearInputButtonProps>;
    }

    interface Components {
        CometAdminClearInputButton?: {
            defaultProps?: ComponentsPropsList["CometAdminClearInputButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminClearInputButton"];
        };
    }
}
