import { ThreeDotSaving } from "@comet/admin-icons";
import { Button as MuiButton, ButtonClassKey, ButtonProps, ComponentsOverrides } from "@mui/material";
import { styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { Tooltip } from "../../Tooltip";

export type FeedbackButtonClassKey = "idle" | "loading" | "success" | "fail" | ButtonClassKey;

type OwnerState = Pick<FeedbackButtonProps, "variant" | "color"> & { displayState?: FeedbackButtonDisplayState };

const Button = styled(MuiButton, {
    name: "CometAdminFeedbackButton",
    slot: "button",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [
            styles.root,
            ownerState.displayState === "idle" && styles.idle,
            ownerState.displayState === "fail" && styles.fail,
            ownerState.displayState === "success" && styles.success,
            ownerState.displayState === "loading" && styles.loading,
        ];
    },
})<{ ownerState: OwnerState }>();

export interface FeedbackButtonProps extends ButtonProps {
    loading?: boolean;
    hasErrors?: boolean;
    loadingIcon?: React.ReactNode;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    tooltipSuccessMessage?: string;
    tooltipErrorMessage?: string;
}

export type FeedbackButtonDisplayState = "idle" | "loading" | "success" | "fail";

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

    const resolveIconForDisplayState = (displayState: FeedbackButtonDisplayState): any => {
        if (startIcon && displayState !== "loading") {
            return startIcon;
        } else if (endIcon && displayState !== "loading") {
            return endIcon;
        }
        if (displayState === "loading") {
            return loadingIcon;
        }
    };

    const resolveTooltipForDisplayState = (displayState: FeedbackButtonDisplayState): any => {
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
        else if (displayState === "loading" && hasErrors === true) {
            timeoutId = window.setTimeout(() => {
                setDisplayState("fail");
            }, 500);
        }
        // Display Success
        else if (displayState === "loading" && loading === false && hasErrors === false) {
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
        <Button
            ownerState={ownerState}
            {...restProps}
            startIcon={
                startIcon && (
                    <Tooltip
                        title={displayState === "fail" ? tooltipErrorMessage : tooltipSuccessMessage}
                        open={displayState === "fail" || (displayState === "success" && true)}
                        placement="top-start"
                        variant={resolveTooltipForDisplayState(displayState)}
                    >
                        {resolveIconForDisplayState(displayState)}
                    </Tooltip>
                )
            }
            endIcon={
                endIcon && !startIcon ? (
                    <Tooltip
                        title={displayState === "fail" ? tooltipErrorMessage : tooltipSuccessMessage}
                        open={(displayState === "fail" || displayState === "success") && true}
                        placement="top-end"
                        variant={resolveTooltipForDisplayState(displayState)}
                    >
                        {resolveIconForDisplayState(displayState)}
                    </Tooltip>
                ) : (
                    <>{endIcon && resolveIconForDisplayState(displayState)}</>
                )
            }
            variant={variant}
            color={color}
            disabled={disabled || displayState === "loading"}
        >
            {children}
        </Button>
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
