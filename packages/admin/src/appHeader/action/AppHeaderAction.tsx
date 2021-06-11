import { ButtonBase, ButtonBaseProps, Typography } from "@material-ui/core";
import { StyledComponentProps } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../../helpers/mergeClasses";
import { CometAdminAppHeaderActionClassKeys, useStyles } from "./AppHeaderAction.styles";

export interface AppHeaderActionProps extends ButtonBaseProps {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    disableTypography?: boolean;
}

export function AppHeaderAction({
    classes: passedClasses,
    children,
    startIcon,
    endIcon,
    disableTypography,
    onClick,
    ...restProps
}: AppHeaderActionProps & StyledComponentProps<CometAdminAppHeaderActionClassKeys>): React.ReactElement {
    const {
        startIcon: startIconClassName,
        endIcon: endIconClassName,
        typography: typographyClassName,
        inner: innerClassName,
        ...buttonBaseClasses
    } = mergeClasses<CometAdminAppHeaderActionClassKeys>(useStyles(), passedClasses);

    return (
        <ButtonBase classes={buttonBaseClasses} {...restProps} onClick={onClick}>
            <div className={innerClassName}>
                {startIcon && <div className={startIconClassName}>{startIcon}</div>}
                {children &&
                    (disableTypography ? (
                        children
                    ) : (
                        <Typography component={"div"} classes={{ root: typographyClassName }}>
                            {children}
                        </Typography>
                    ))}
                {endIcon && <div className={endIconClassName}>{endIcon}</div>}
            </div>
        </ButtonBase>
    );
}
