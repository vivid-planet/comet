import { Clear } from "@comet/admin-icons";
import {
    ButtonBase,
    ComponentsOverrides,
    css,
    Grow,
    InputAdornment,
    InputAdornmentClassKey,
    InputAdornmentProps,
    selectClasses,
    styled,
    Theme,
    useThemeProps,
} from "@mui/material";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import * as React from "react";

export interface ClearInputAdornmentProps
    extends InputAdornmentProps,
        ThemedComponentBaseProps<{
            root: typeof InputAdornment;
            buttonBase: typeof ButtonBase;
        }> {
    icon?: React.ReactNode;
    onClick: () => void;
    hasClearableContent: boolean;
}

type OwnerState = Pick<ClearInputAdornmentProps, "position">;

export type ClearInputAdornmentClassKey = InputAdornmentClassKey | "buttonBase";

export const ClearInputAdornment = (inProps: ClearInputAdornmentProps): React.ReactElement => {
    const {
        hasClearableContent,
        onClick,
        position,
        icon = <Clear fontSize="inherit" />,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminClearInputAdornment" });

    const ownerState: OwnerState = {
        position,
    };

    return (
        <Grow in={hasClearableContent}>
            <Root position={position} ownerState={ownerState} {...slotProps?.root} {...restProps}>
                <Button tabIndex={-1} onClick={onClick} {...slotProps?.buttonBase}>
                    {icon}
                </Button>
            </Root>
        </Grow>
    );
};

const Root = styled(InputAdornment, {
    name: "CometAdminClearInputAdornment",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => css`
        ${ownerState.position === "start" &&
        css`
            &:last-child {
                margin-left: ${theme.spacing(-2)};
            }
        `}

        ${ownerState.position === "end" &&
        css`
            &:last-child {
                margin-right: ${theme.spacing(-2)};
            }

            .${selectClasses.select} ~ &:last-child {
                // Reset the margin when used inside a MuiSelect, as MuiSelect-icon is moved to the end of the input using 'order' and is, therefore, the "real" last-child.
                margin-right: 0;
            }
        `}
    `,
);

const Button = styled(ButtonBase, {
    name: "CometAdminClearInputAdornment",
    slot: "buttonBase",
    overridesResolver(_, styles) {
        return [styles.buttonBase];
    },
})(
    ({ theme }) => css`
        padding-left: 10px;
        padding-right: 10px;
        height: 100%;
        color: ${theme.palette.grey[200]};
        font-size: 12px;
    `,
);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminClearInputAdornment: ClearInputAdornmentClassKey;
    }

    interface ComponentsPropsList {
        CometAdminClearInputAdornment: Partial<ClearInputAdornmentProps>;
    }

    interface Components {
        CometAdminClearInputAdornment?: {
            defaultProps?: ComponentsPropsList["CometAdminClearInputAdornment"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminClearInputAdornment"];
        };
    }
}
