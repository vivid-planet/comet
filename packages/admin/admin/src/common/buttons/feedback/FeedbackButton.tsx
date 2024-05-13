import { ThreeDotSaving } from "@comet/admin-icons";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { ButtonClassKey, ComponentsOverrides } from "@mui/material";
import { Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { Tooltip as CometTooltip } from "../../Tooltip";

export type FeedbackButtonClassKey = "idle" | "loading" | "success" | "error" | "tooltip" | ButtonClassKey;

type OwnerState = { displayState: FeedbackButtonDisplayState };

const Root = createComponentSlot(LoadingButton)<FeedbackButtonClassKey, OwnerState>({
    componentName: "FeedbackButton",
    slotName: "root",
    classesResolver(ownerState) {
        return [
            ownerState.displayState === "idle" && "idle",
            ownerState.displayState === "error" && "error",
            ownerState.displayState === "success" && "success",
            ownerState.displayState === "loading" && "loading",
        ];
    },
})();

const Tooltip = createComponentSlot(CometTooltip)<FeedbackButtonClassKey>({
    componentName: "FeedbackButton",
    slotName: "tooltip",
})();

export interface FeedbackButtonProps
    extends ThemedComponentBaseProps<{
            root: typeof LoadingButton;
            tooltip: typeof CometTooltip;
        }>,
        LoadingButtonProps {
    loading?: boolean;
    hasErrors?: boolean;
    loadingIcon?: React.ReactNode;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    tooltipSuccessMessage?: React.ReactNode;
    tooltipErrorMessage?: React.ReactNode;
}

type FeedbackButtonDisplayState = "idle" | "loading" | "success" | "error";

export function FeedbackButton(inProps: FeedbackButtonProps) {
    const {
        loading,
        hasErrors,
        children,
        variant = "contained",
        color = "primary",
        classes,
        disabled,
        startIcon,
        endIcon,
        tooltipSuccessMessage,
        tooltipErrorMessage,
        slotProps,

        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminFeedbackButton",
    });

    const [displayState, setDisplayState] = React.useState<FeedbackButtonDisplayState>("idle");

    const ownerState: OwnerState = {
        displayState: displayState,
    };

    const resolveTooltipForDisplayState = (displayState: FeedbackButtonDisplayState) => {
        if (displayState === "success") {
            return "success";
        } else if (displayState === "error") {
            return "error";
        } else {
            return "neutral";
        }
    };

    React.useEffect(() => {
        let timeoutId: number | undefined;
        let timeoutDuration: number | undefined;
        let newDisplayState: FeedbackButtonDisplayState;

        if (displayState === "idle" && loading) {
            setDisplayState("loading");
        } else if (displayState === "loading" && hasErrors) {
            timeoutDuration = 500;
            newDisplayState = "loading";
        } else if (displayState === "loading" && !loading && !hasErrors) {
            timeoutDuration = 500;
            newDisplayState = "success";
        } else if (displayState === "error") {
            timeoutDuration = 5000;
            newDisplayState = "idle";
        } else if (displayState === "success") {
            timeoutDuration = 2000;
            newDisplayState = "idle";
        }

        if (timeoutDuration !== undefined) {
            timeoutId = window.setTimeout(() => {
                setDisplayState(newDisplayState);
            }, timeoutDuration);
        }
        return () => {
            if (timeoutId !== undefined) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [displayState, loading, hasErrors]);

    const tooltip = (
        <Tooltip
            title={displayState === "error" ? tooltipErrorMessage : tooltipSuccessMessage}
            open={displayState === "error" || displayState === "success"}
            placement={endIcon && !startIcon ? "top-end" : "top-start"}
            variant={resolveTooltipForDisplayState(displayState)}
            {...slotProps?.tooltip}
        >
            <span>{startIcon ? startIcon : endIcon}</span>
        </Tooltip>
    );

    return (
        <Root
            ownerState={ownerState}
            loading={loading}
            variant={variant}
            color={color}
            disabled={disabled || displayState === "loading"}
            loadingPosition={startIcon ? "start" : "end"}
            loadingIndicator={<ThreeDotSaving />}
            startIcon={startIcon && tooltip}
            endIcon={endIcon && !startIcon ? tooltip : { endIcon }}
            {...slotProps}
            {...restProps}
        >
            {children}
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFeedbackButton: FeedbackButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFeedbackButton: FeedbackButtonProps;
    }

    interface Components {
        CometAdminFeedbackButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFeedbackButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFeedbackButton"];
        };
    }
}
