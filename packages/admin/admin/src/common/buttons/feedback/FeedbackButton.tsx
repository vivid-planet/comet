import { ThreeDotSaving } from "@comet/admin-icons";
import { Button, ButtonClassKey, ButtonProps, ComponentsOverrides } from "@mui/material";
import { Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { Tooltip } from "../../Tooltip";

export type FeedbackButtonClassKey = "idle" | "loading" | "success" | "fail" | "successTooltip" | "errorTooltip" | ButtonClassKey;

type OwnerState = Pick<FeedbackButtonProps, "variant" | "color"> & { displayState?: FeedbackButtonDisplayState };

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

const SuccessTooltip = createComponentSlot(Tooltip)<FeedbackButtonClassKey>({
    componentName: "FeedbackButton",
    slotName: "successTooltip",
})();

const ErrorTooltip = createComponentSlot(Tooltip)<FeedbackButtonClassKey>({
    componentName: "FeedbackButton",
    slotName: "errorTooltip",
})();

export interface FeedbackButtonProps
    extends ThemedComponentBaseProps<{
            root: typeof Button;
            successTooltip: typeof Tooltip;
            errorTooltip: typeof Tooltip;
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
        variant,
        color,
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

        if (displayState === "idle" && loading) {
            setDisplayState("loading");
        }

        // Display Error
        else if (displayState === "loading" && hasErrors) {
            timeoutId = window.setTimeout(() => {
                setDisplayState("fail");
            }, 500);
        }
        // Display Success
        else if (displayState === "loading" && loading === false && !hasErrors) {
            timeoutId = window.setTimeout(() => {
                setDisplayState("success");
            }, 500);
        }
        // Return to idle
        else if (displayState === "fail") {
            timeoutId = window.setTimeout(() => {
                setDisplayState("idle");
            }, 5000);
        }
        // Return to idle
        else if (displayState === "success") {
            timeoutId = window.setTimeout(() => {
                setDisplayState("idle");
            }, 2000);
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
                    <SuccessTooltip
                        title={displayState === "fail" ? tooltipErrorMessage : tooltipSuccessMessage}
                        open={displayState === "fail" || (displayState === "success" && true)}
                        placement="top-start"
                        variant={resolveTooltipForDisplayState(displayState)}
                        {...slotProps?.successTooltip}
                    >
                        <>{resolveIconForDisplayState(displayState)}</>
                    </SuccessTooltip>
                )
            }
            endIcon={
                endIcon && !startIcon ? (
                    <ErrorTooltip
                        title={displayState === "fail" ? tooltipErrorMessage : tooltipSuccessMessage}
                        open={(displayState === "fail" || displayState === "success") && true}
                        placement="top-end"
                        variant={resolveTooltipForDisplayState(displayState)}
                        {...slotProps?.errorTooltip}
                    >
                        <>{resolveIconForDisplayState(displayState)}</>
                    </ErrorTooltip>
                ) : (
                    <>{endIcon && resolveIconForDisplayState(displayState)}</>
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
