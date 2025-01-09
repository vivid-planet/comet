import { Button as MuiButton, ButtonProps as MuiButtonProps, ComponentsOverrides, Theme, useThemeProps } from "@mui/material";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

export type ButtonClassKey = "root";

export type ButtonProps = MuiButtonProps &
    ThemedComponentBaseProps<{
        root: typeof MuiButton;
    }>;

export const Button = (inProps: ButtonProps) => {
    const { slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminButton" });
    return <Root {...restProps} {...slotProps?.root} />;
};

const Root = createComponentSlot(MuiButton)<ButtonClassKey>({
    componentName: "Button",
    slotName: "root",
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
