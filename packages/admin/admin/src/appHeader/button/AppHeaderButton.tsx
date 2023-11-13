import { ButtonBase, ButtonBaseProps, ComponentsOverrides, Theme, Typography } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { AppHeaderButtonClassKey, styles } from "./AppHeaderButton.styles";

export interface AppHeaderButtonProps extends ButtonBaseProps {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    disableTypography?: boolean;
}

function Button({
    classes,
    children,
    startIcon,
    endIcon,
    disableTypography,
    onClick,
    ...restProps
}: AppHeaderButtonProps & WithStyles<typeof styles>): React.ReactElement {
    const {
        startIcon: startIconClassName,
        endIcon: endIconClassName,
        typography: typographyClassName,
        inner: innerClassName,
        ...buttonBaseClasses
    } = classes;

    return (
        <ButtonBase classes={buttonBaseClasses} {...restProps} onClick={onClick}>
            <div className={innerClassName}>
                {startIcon && <div className={startIconClassName}>{startIcon}</div>}
                {children &&
                    (disableTypography ? (
                        children
                    ) : (
                        <Typography component="div" classes={{ root: typographyClassName }}>
                            {children}
                        </Typography>
                    ))}
                {endIcon && <div className={endIconClassName}>{endIcon}</div>}
            </div>
        </ButtonBase>
    );
}

export const AppHeaderButton = withStyles(styles, { name: "CometAdminAppHeaderButton" })(Button);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminAppHeaderButton: AppHeaderButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminAppHeaderButton: Partial<AppHeaderButtonProps>;
    }

    interface Components {
        CometAdminAppHeaderButton?: {
            defaultProps?: ComponentsPropsList["CometAdminAppHeaderButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminAppHeaderButton"];
        };
    }
}
