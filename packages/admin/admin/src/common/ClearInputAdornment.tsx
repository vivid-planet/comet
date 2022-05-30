import { Clear } from "@comet/admin-icons";
import {
    ButtonBase,
    ComponentsOverrides,
    Grow,
    InputAdornment,
    InputAdornmentClassKey,
    InputAdornmentProps,
    selectClasses,
    Theme,
} from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

export interface ClearInputAdornmentProps extends InputAdornmentProps {
    icon?: React.ReactNode;
    onClick: () => void;
    hasClearableContent: boolean;
}

export const ClearAdornment = ({
    classes,
    icon = <Clear />,
    onClick,
    hasClearableContent,
    ...restProps
}: WithStyles<typeof styles> & ClearInputAdornmentProps): React.ReactElement => {
    const { buttonBase: buttonBaseClassName, ...restClasses } = classes;
    return (
        <Grow in={hasClearableContent}>
            <InputAdornment {...restProps} classes={restClasses}>
                <ButtonBase className={buttonBaseClassName} tabIndex={-1} onClick={onClick}>
                    {icon}
                </ButtonBase>
            </InputAdornment>
        </Grow>
    );
};

export type ClearInputAdornmentClassKey = InputAdornmentClassKey | "buttonBase";

const styles = ({ palette, spacing }: Theme) => {
    return createStyles<ClearInputAdornmentClassKey, ClearInputAdornmentProps>({
        root: {},
        filled: {},
        outlined: {},
        standard: {},
        positionStart: {
            "&:last-child": {
                marginLeft: spacing(-2),
            },
        },
        positionEnd: {
            "&:last-child": {
                marginRight: spacing(-2),
            },
            [`.${selectClasses.select} ~ &:last-child`]: {
                // Reset the margin when used inside a MuiSelect, as MuiSelect-icon is moved to the end of the input using `order` and is, therefore, the "real" last-child.
                marginRight: 0,
            },
        },
        disablePointerEvents: {},
        hiddenLabel: {},
        sizeSmall: {},
        buttonBase: {
            height: "100%",
            width: 40,
            color: palette.action.active,
        },
    });
};

export const ClearInputAdornment = withStyles(styles, { name: "CometAdminClearInputAdornment" })(ClearAdornment);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminClearInputAdornment: ClearInputAdornmentClassKey;
    }

    interface ComponentsPropsList {
        CometAdminClearInputAdornment: ClearInputAdornmentProps;
    }

    interface Components {
        CometAdminClearInputAdornment?: {
            defaultProps?: ComponentsPropsList["CometAdminClearInputAdornment"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminClearInputAdornment"];
        };
    }
}
