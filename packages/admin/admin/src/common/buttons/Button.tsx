import { Breakpoint, Button as MuiButton, ButtonProps as MuiButtonProps, ComponentsOverrides, Theme, useThemeProps } from "@mui/material";
import { ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

export type ButtonClassKey = "root";

type ButtonThemeProps = ThemedComponentBaseProps<{
    root: typeof MuiButton;
}>;

type ResponsiveBehaviorOptions = {
    breakpoint?: Breakpoint;
    mobileIcon?: "startIcon" | "endIcon" | ReactNode;
};

type FeedbackBehaviorOptions = {
    successMessage?: ReactNode;
    errorMessage?: ReactNode;
    loading?: boolean;
    hasError?: boolean;
    tooltipDuration?: {
        success?: number;
        error?: number;
    };
};

/**
 * TODO:
 * - Restrice imports from MuiButton
 * - Consider if we should also use this for IconButtons (and restrict imports from MuiIconButton)
 */

type CustomButtonProps = {
    // TODO: Implement responsive behavior
    // TODO: Should we render an `IconButton` component or style `Button` to work with just an icon?
    responsiveBehavior?: boolean | ResponsiveBehaviorOptions;

    // TODO: Implement feedback on click behavior
    // TODO: Figure out if we only need the controlled or uncontrolled version
    feedbackBehavior?: boolean | FeedbackBehaviorOptions;

    iconMapping?: {
        loading?: ReactNode;
    };
};

export type ButtonProps = CustomButtonProps & ButtonThemeProps & MuiButtonProps;

export const Button = (props: ButtonProps) => {
    const { slotProps, responsiveBehavior, feedbackBehavior, ...restProps } = useThemeProps({ props, name: "CometAdminButton" });

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
