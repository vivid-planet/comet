import { ButtonBase, ButtonBaseProps, Typography } from "@material-ui/core";
import { StyledComponentProps } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../../helpers/mergeClasses";
import { CometAdminAppHeaderButtonClassKeys, useStyles } from "./AppHeaderButton.styles";

export interface AppHeaderButtonProps extends ButtonBaseProps {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    disableTypography?: boolean;
}

export function AppHeaderButton({
    classes: passedClasses,
    children,
    startIcon,
    endIcon,
    disableTypography,
    onClick,
    ...restProps
}: AppHeaderButtonProps & StyledComponentProps<CometAdminAppHeaderButtonClassKeys>): React.ReactElement {
    const {
        startIcon: startIconClassName,
        endIcon: endIconClassName,
        typography: typographyClassName,
        inner: innerClassName,
        ...buttonBaseClasses
    } = mergeClasses<CometAdminAppHeaderButtonClassKeys>(useStyles(), passedClasses);

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
