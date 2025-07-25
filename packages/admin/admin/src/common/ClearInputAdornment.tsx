import { Clear } from "@comet/admin-icons";
import {
    ButtonBase,
    type ComponentsOverrides,
    css,
    Grow,
    InputAdornment,
    type InputAdornmentClassKey,
    type InputAdornmentProps,
    selectClasses,
    type Theme,
    useThemeProps,
} from "@mui/material";
import { type ReactNode } from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export interface ClearInputAdornmentProps
    extends InputAdornmentProps,
        ThemedComponentBaseProps<{
            root: typeof InputAdornment;
            buttonBase: typeof ButtonBase;
        }> {
    icon?: ReactNode;
    onClick: () => void;
    hasClearableContent: boolean;
}

type OwnerState = Pick<ClearInputAdornmentProps, "position">;

export type ClearInputAdornmentClassKey = InputAdornmentClassKey | "buttonBase";

export const ClearInputAdornment = (inProps: ClearInputAdornmentProps) => {
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

    if (!hasClearableContent) {
        return null;
    }

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

const Root = createComponentSlot(InputAdornment)<ClearInputAdornmentClassKey, OwnerState>({
    componentName: "ClearInputAdornment",
    slotName: "root",
})(
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

const Button = createComponentSlot(ButtonBase)<ClearInputAdornmentClassKey>({
    componentName: "ClearInputAdornment",
    slotName: "buttonBase",
})(
    ({ theme }) => css`
        padding-left: 10px;
        padding-right: 10px;
        height: 100%;
        color: ${theme.palette.grey[300]};
        font-size: 12px;
    `,
);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminClearInputAdornment: ClearInputAdornmentClassKey;
    }

    interface ComponentsPropsList {
        CometAdminClearInputAdornment: ClearInputAdornmentProps;
    }

    interface Components {
        CometAdminClearInputAdornment?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminClearInputAdornment"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminClearInputAdornment"];
        };
    }
}
