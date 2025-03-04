import { Check, Error, Error as ErrorIcon, Save, ThreeDotSaving } from "@comet/admin-icons";
import { Button, ButtonClassKey, buttonGroupClasses, ButtonProps, ComponentsOverrides } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import { ReactNode, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { messages } from "../../../messages";
import { useSplitButtonContext } from "../split/useSplitButtonContext";

export type SaveButtonClassKey = "saving" | "error" | "success" | "conflict" | ButtonClassKey;

type OwnerState = Pick<SaveButtonProps, "variant" | "color"> & { displayState?: SaveButtonDisplayState };

const Root = createComponentSlot(Button)<SaveButtonClassKey, OwnerState>({
    componentName: "SaveButton",
    slotName: "root",
    classesResolver(ownerState) {
        return [
            ownerState.displayState === "saving" && "saving",
            ownerState.displayState === "error" && "error",
            ownerState.displayState === "success" && "success",
            ownerState.displayState === "conflict" && "conflict",
        ];
    },
})(
    ({ ownerState, theme }) => css`
        ${ownerState.displayState === "saving" &&
        css`
            &:disabled {
                ${ownerState.variant === "contained" &&
                ownerState.color === "primary" &&
                css`
                    color: ${theme.palette.primary.contrastText};
                    background-color: ${theme.palette.primary.main};
                `};
                ${ownerState.variant === "contained" &&
                ownerState.color === "secondary" &&
                css`
                    color: ${theme.palette.secondary.contrastText};
                    background-color: ${theme.palette.secondary.main};
                `}
            }
        `}
        ${ownerState.displayState === "error" &&
        css`
            &:disabled {
                color: ${theme.palette.error.contrastText};
                background-color: ${theme.palette.error.light};
            }
        `}
        ${ownerState.displayState === "success" &&
        css`
            &:disabled {
                color: ${theme.palette.success.contrastText};
                background-color: ${theme.palette.success.light};
            }
        `}
        ${ownerState.displayState === "conflict" &&
        css`
            color: ${theme.palette.error.contrastText};
            background-color: ${theme.palette.error.main};
            &:hover {
                background-color: ${theme.palette.error.dark};
            }
            &.${buttonGroupClasses.grouped}:not(:last-child) {
                border-right-color: ${theme.palette.error.dark};
            }
        `}
    `,
);

export interface SaveButtonProps extends ButtonProps {
    saving?: boolean;
    hasErrors?: boolean;
    hasConflict?: boolean;
    savingItem?: ReactNode;
    successItem?: ReactNode;
    errorItem?: ReactNode;
    conflictItem?: ReactNode;
    saveIcon?: ReactNode;
    savingIcon?: ReactNode;
    successIcon?: ReactNode;
    errorIcon?: ReactNode;
    conflictIcon?: ReactNode;
}

export type SaveButtonDisplayState = "idle" | "saving" | "success" | "error" | "conflict";

/**
 * @deprecated Use the `FeedbackButton` instead
 */
export function SaveButton(inProps: SaveButtonProps) {
    const {
        saving = false,
        hasErrors = false,
        hasConflict = false,
        children = <FormattedMessage {...messages.save} />,
        savingItem = <FormattedMessage id="comet.saveButton.savingItem.title" defaultMessage="Saving" />,
        successItem = <FormattedMessage id="comet.saveButton.successItem.title" defaultMessage="Successfully Saved" />,
        errorItem = <FormattedMessage id="comet.saveButton.errorItem.title" defaultMessage="Save Error" />,
        conflictItem = <FormattedMessage {...messages.saveConflict} />,
        saveIcon = <Save />,
        savingIcon = <ThreeDotSaving />,
        successIcon = <Check />,
        errorIcon = <Error />,
        conflictIcon = <ErrorIcon />,
        variant = "contained",
        color = "primary",
        disabled,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminSaveButton",
    });

    const [displayState, setDisplayState] = useState<SaveButtonDisplayState>("idle");
    const saveSplitButton = useSplitButtonContext();

    const ownerState: OwnerState = {
        displayState: displayState,
        variant,
        color,
    };

    const resolveIconForDisplayState = (displayState: SaveButtonDisplayState): ReactNode => {
        if (displayState === "saving") {
            return savingIcon;
        } else if (displayState === "success") {
            return successIcon;
        } else if (displayState === "error") {
            return errorIcon;
        } else if (displayState === "conflict") {
            return conflictIcon;
        }
        return saveIcon;
    };

    useEffect(() => {
        let timeoutId: number | undefined;

        if ((displayState === "idle" || displayState === "conflict") && saving) {
            setDisplayState("saving");
        }
        // Display Conflict
        else if (displayState === "idle" && hasConflict) {
            setDisplayState("conflict");
        }
        // Display Error
        else if (displayState === "saving" && hasErrors === true) {
            timeoutId = window.setTimeout(() => {
                setDisplayState("error");
            }, 500);
        }
        // Display Success
        else if (displayState === "saving" && saving === false && hasErrors === false) {
            timeoutId = window.setTimeout(() => {
                setDisplayState("success");
            }, 500);
        }
        // Return to idle
        else if (displayState === "error") {
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
    }, [displayState, saving, hasErrors, hasConflict]);

    useEffect(() => {
        if (displayState === "idle") {
            saveSplitButton?.setShowSelectButton(undefined);
        } else if (displayState === "saving") {
            saveSplitButton?.setShowSelectButton(false);
        } else if (displayState === "success") {
            saveSplitButton?.setShowSelectButton(false);
        } else if (displayState === "error") {
            saveSplitButton?.setShowSelectButton(false);
        } else if (displayState === "conflict") {
            saveSplitButton?.setShowSelectButton(undefined);
        }
    }, [displayState, saveSplitButton]);

    return (
        <Root
            ownerState={ownerState}
            {...restProps}
            startIcon={resolveIconForDisplayState(displayState)}
            variant={variant}
            color={color}
            disabled={disabled || (displayState != "idle" && displayState != "conflict")}
        >
            {displayState === "idle" && children}
            {displayState === "saving" && savingItem}
            {displayState === "success" && successItem}
            {displayState === "error" && errorItem}
            {displayState === "conflict" && conflictItem}
        </Root>
    );
}
declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminSaveButton: SaveButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminSaveButton: SaveButtonProps;
    }

    interface Components {
        CometAdminSaveButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminSaveButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminSaveButton"];
        };
    }
}
