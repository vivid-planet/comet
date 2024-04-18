import { ThreeDotSaving } from "@comet/admin-icons";
import { Button, ButtonClassKey, ButtonProps, ComponentsOverrides } from "@mui/material";
import { Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { Tooltip as CometTooltip } from "../../Tooltip";

export type FeedbackButtonClassKey = "idle" | "loading" | "success" | "fail" | "tooltip" | ButtonClassKey;

type OwnerState = { displayState: FeedbackButtonDisplayState };

const Root = createComponentSlot(Button)<FeedbackButtonClassKey, OwnerState>({
    componentName: "FeedbackButton",
    slotName: "root",
    classesResolver(ownerState) {
        return [
            ownerState.displayState === "idle" && "idle",
            ownerState.displayState === "fail" && "fail",
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
            root: typeof Button;
            tooltip: typeof CometTooltip;
        }>,
        ButtonProps {
    loading?: boolean;
    hasErrors?: boolean;
    loadingIcon?: React.ReactNode;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    tooltipSuccessMessage?: string;
    tooltipErrorMessage?: string;
}

type FeedbackButtonDisplayState = "idle" | "loading" | "success" | "fail";

export function FeedbackButton(inProps: FeedbackButtonProps) {
    const {
        loading,
        hasErrors,
        children,
        variant = "contained",
        color = "primary",
        classes,
        disabled,
        loadingIcon = <ThreeDotSaving />,
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

    const resolveIconForDisplayState = (displayState: FeedbackButtonDisplayState) => {
        if (startIcon && displayState !== "loading") {
            return startIcon;
        } else if (endIcon && displayState !== "loading") {
            return endIcon;
        }
        if (displayState === "loading") {
            return loadingIcon;
        }
    };

    const resolveTooltipForDisplayState = (displayState: FeedbackButtonDisplayState) => {
        if (displayState === "success") {
            return "success";
        } else if (displayState === "fail") {
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
        } else if (displayState === "fail") {
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

    return (
        <Root
            ownerState={ownerState}
            {...slotProps}
            {...restProps}
            startIcon={
                startIcon && (
                    <Tooltip
                        title={displayState === "fail" ? tooltipErrorMessage : tooltipSuccessMessage}
                        open={displayState === "fail" || displayState === "success"}
                        placement="top-start"
                        variant={resolveTooltipForDisplayState(displayState)}
                        {...slotProps?.tooltip}
                    >
                        <span>{resolveIconForDisplayState(displayState)}</span>
                    </Tooltip>
                )
            }
            endIcon={
                endIcon && !startIcon ? (
                    <Tooltip
                        title={displayState === "fail" ? tooltipErrorMessage : tooltipSuccessMessage}
                        open={displayState === "fail" || displayState === "success"}
                        placement="top-end"
                        variant={resolveTooltipForDisplayState(displayState)}
                        {...slotProps?.tooltip}
                    >
                        <>{resolveIconForDisplayState(displayState)}</>
                    </Tooltip>
                ) : (
                    <span>{endIcon && resolveIconForDisplayState(displayState)}</span>
                )
            }
            variant={variant}
            color={color}
            disabled={disabled || displayState === "loading"}
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
            defaultProps?: ComponentsPropsList["CometAdminFeedbackButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFeedbackButton"];
        };
    }
}
