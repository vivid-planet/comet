import { Button as MuiButton, ButtonProps as MuiButtonProps, ComponentsOverrides, Theme, useThemeProps } from "@mui/material";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

type Variant = "primary" | "secondary" | "outlined" | "descructive" | "success" | "textLight" | "textDark";

type Slot = "root" | "mobileTooltip";
export type ButtonClassKey = Slot | Variant;

export type ButtonProps = Omit<MuiButtonProps, "variant" | "color"> &
    ThemedComponentBaseProps<{
        root: typeof MuiButton;
    }> & {
        variant?: Variant;
    };

type OwnerState = {
    variant: Variant;
};

const variantToMuiProps: Record<Variant, Partial<MuiButtonProps>> = {
    primary: { variant: "contained", color: "primary" },
    secondary: { variant: "contained", color: "secondary" },
    outlined: { variant: "outlined" },
    descructive: { variant: "outlined", color: "error" },
    success: { variant: "contained", color: "success" },
    textLight: { variant: "text", sx: { color: "white" } },
    textDark: { variant: "text", sx: { color: "black" } },
};

export const Button = (inProps: ButtonProps) => {
    const { slotProps, variant = "primary", ...restProps } = useThemeProps({ props: inProps, name: "CometAdminButton" });

    const ownerState: OwnerState = {
        variant,
    };

    return <Root {...variantToMuiProps[variant]} {...restProps} {...slotProps?.root} ownerState={ownerState} />;
};

const Root = createComponentSlot(MuiButton)<ButtonClassKey, OwnerState>({
    componentName: "Button",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.variant];
    },
})();

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminButton: ButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminButton: ButtonProps;
    }

    interface Components {
        CometAdminButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminButton"];
        };
    }
}
