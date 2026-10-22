import { ThreeDotSaving } from "@dextinity/admin-icons";
import { type ReactNode, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { Tooltip, type TooltipProps } from "../../Tooltip";
import { Button, type ButtonClassKey, type ButtonProps } from "../Button";

export type FeedbackButtonClassKey = "idle" | "loading" | "success" | "error" | "tooltip" | ButtonClassKey;

export interface FeedbackButtonProps extends Omit<ButtonProps, "onClick" | "slotProps"> {
    onClick?: () => void | Promise<void>;
    hasErrors?: boolean;
    loading?: boolean;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    tooltipSuccessMessage?: ReactNode;
    tooltipErrorMessage?: ReactNode;
    slotProps?: {
        root?: Partial<ButtonProps>;
        tooltip?: Partial<TooltipProps>;
    };
}

type FeedbackButtonDisplayState = "idle" | "loading" | "success" | "error";

export function FeedbackButton({
    onClick,
    loading,
    hasErrors,
    children,
    disabled,
    startIcon,
    endIcon,
    tooltipSuccessMessage = <FormattedMessage id="dextinity.feedbackButton.tooltipSuccessMessage" defaultMessage="Success" />,
    tooltipErrorMessage = <FormattedMessage id="dextinity.feedbackButton.tooltipErrorMessage" defaultMessage="Error" />,
    slotProps,
    ...restProps
}: FeedbackButtonProps) {
    const [displayState, setDisplayState] = useState<FeedbackButtonDisplayState>("idle");

    const isUncontrolled = loading === undefined && hasErrors === undefined;

    const handleOnClick =
        isUncontrolled && onClick
            ? async () => {
                  try {
                      setDisplayState("loading");
                      await onClick();
                      setDisplayState("success");
                  } catch {
                      setDisplayState("error");
                  } finally {
                      setTimeout(() => {
                          setDisplayState("idle");
                      }, 3000);
                  }
              }
            : onClick;

    useEffect(() => {
        if (isUncontrolled) {
            return;
        }

        let timeoutId: number | undefined;
        let timeoutDuration: number | undefined;
        let newDisplayState: FeedbackButtonDisplayState;

        if (displayState === "idle" && loading) {
            setDisplayState("loading");
        } else if (displayState === "loading" && hasErrors) {
            timeoutDuration = 0;
            newDisplayState = "error";
        } else if (displayState === "loading" && !loading && !hasErrors) {
            timeoutDuration = 50;
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
    }, [displayState, loading, hasErrors, isUncontrolled]);

    const isLoading = loading !== undefined ? loading : displayState === "loading";
    const hasFeedback = displayState === "error" || displayState === "success";
    const loadingIcon = <ThreeDotSaving />;
    const showsLoadingAtStart = Boolean(startIcon);

    return (
        <Tooltip
            title={displayState === "error" ? tooltipErrorMessage : tooltipSuccessMessage}
            open={hasFeedback}
            disabled={!hasFeedback}
            placement={endIcon && !startIcon ? "top-end" : "top-start"}
            color={displayState === "error" ? "error" : "success"}
            {...slotProps?.tooltip}
        >
            <Button
                onClick={handleOnClick}
                disabled={disabled || isLoading}
                focusableWhenDisabled={isLoading}
                aria-busy={isLoading || undefined}
                data-feedback={displayState}
                startIcon={isLoading && showsLoadingAtStart ? loadingIcon : startIcon}
                endIcon={isLoading && !showsLoadingAtStart ? loadingIcon : endIcon}
                {...slotProps?.root}
                {...restProps}
            >
                {children}
            </Button>
        </Tooltip>
    );
}
