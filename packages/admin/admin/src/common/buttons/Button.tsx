import {
    Breakpoint,
    Button as MuiButton,
    ButtonProps as MuiButtonProps,
    ComponentsOverrides,
    css,
    Theme,
    Tooltip,
    useTheme,
    useThemeProps,
} from "@mui/material";
import { ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { useWindowSize } from "../../helpers/useWindowSize";

type StateClassKey = "usingResponsiveBehavior";
type SlotClassKey = "root" | "mobileTooltip";

export type ButtonClassKey = StateClassKey | SlotClassKey;

type ButtonThemeProps = ThemedComponentBaseProps<{
    root: typeof MuiButton;
    mobileTooltip: typeof Tooltip;
}>;

type ResponsiveBehaviorSettings = {
    breakpoint: Breakpoint;
    mobileIcon: ReactNode;
};

type ResponsiveBehaviorOptions = Omit<Partial<ResponsiveBehaviorSettings>, "mobileIcon"> & {
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

type OwnerState = {
    usingResponsiveBehavior: boolean;
};

/**
 * TODO:
 * - Restrice imports from MuiButton
 * - Consider if we should also use this for IconButtons (and restrict imports from MuiIconButton)
 */

type CustomButtonProps = {
    responsiveBehavior?: boolean | ResponsiveBehaviorOptions;

    // TODO: Implement feedback on click behavior
    // TODO: Figure out if we only need the controlled or uncontrolled version
    feedbackBehavior?: boolean | FeedbackBehaviorOptions;

    iconMapping?: {
        loading?: ReactNode;
    };
};

export type ButtonProps = CustomButtonProps & ButtonThemeProps & MuiButtonProps;

const getResponsiveBehaviorSettings = (propValue: ButtonProps["responsiveBehavior"], startIcon: ReactNode, endIcon: ReactNode) => {
    let settings: ResponsiveBehaviorSettings = {
        breakpoint: "sm",
        mobileIcon: startIcon || endIcon,
    };

    if (typeof propValue === "object") {
        settings = {
            ...settings,
            ...propValue,
        };

        if (propValue.mobileIcon === undefined || propValue.mobileIcon === "startIcon") {
            settings.mobileIcon = startIcon;
        } else if (settings.mobileIcon === "endIcon") {
            propValue.mobileIcon = endIcon;
        } else {
            settings.mobileIcon = propValue.mobileIcon;
        }
    }

    return settings;
};

export const Button = (props: ButtonProps) => {
    const { slotProps, responsiveBehavior, feedbackBehavior, children, startIcon, endIcon, ...restProps } = useThemeProps({
        props,
        name: "CometAdminButton",
    });

    const windowSize = useWindowSize();
    const theme = useTheme();

    const responsiveBehaviorSettings = getResponsiveBehaviorSettings(responsiveBehavior, startIcon, endIcon);
    const usingResponsiveBehavior = Boolean(responsiveBehavior) && windowSize.width < theme.breakpoints.values[responsiveBehaviorSettings.breakpoint];

    const ownerState: OwnerState = {
        usingResponsiveBehavior,
    };

    const buttonNode = (
        <Root
            startIcon={usingResponsiveBehavior ? undefined : startIcon}
            endIcon={usingResponsiveBehavior ? undefined : endIcon}
            ownerState={ownerState}
            {...restProps}
            {...slotProps?.root}
        >
            {usingResponsiveBehavior ? responsiveBehaviorSettings.mobileIcon : children}
        </Root>
    );

    if (usingResponsiveBehavior) {
        return (
            <MobileTooltip title={children} {...slotProps?.mobileTooltip}>
                {buttonNode}
            </MobileTooltip>
        );
    }

    return buttonNode;
};

const Root = createComponentSlot(MuiButton)<ButtonClassKey, OwnerState>({
    componentName: "Button",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.usingResponsiveBehavior && "usingResponsiveBehavior"];
    },
})(
    ({ ownerState }) => css`
        ${ownerState.usingResponsiveBehavior &&
        css`
            // TODO: Should the size be smaller than in the standard button design? Like the 'ToolbarActionButton'
            min-width: 0;
        `}
    `,
);

const MobileTooltip = createComponentSlot(Tooltip)<ButtonClassKey>({
    componentName: "Button",
    slotName: "mobileTooltip",
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
