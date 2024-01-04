import { Check, Error, Error as ErrorIcon, Save, ThreeDotSaving } from "@comet/admin-icons";
import { Button, ButtonClassKey, ButtonProps, ComponentsOverrides, Theme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import { ClassKeyOfStyles } from "@mui/styles/withStyles";
import { ClassNameMap } from "@mui/styles/withStyles/withStyles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../messages";
import { useSplitButtonContext } from "../split/useSplitButtonContext";
import { SaveButtonClassKey, styles } from "./SaveButton.styles";

export interface SaveButtonProps extends ButtonProps {
    saving?: boolean;
    hasErrors?: boolean;
    hasConflict?: boolean;
    savingItem?: React.ReactNode;
    successItem?: React.ReactNode;
    errorItem?: React.ReactNode;
    conflictItem?: React.ReactNode;
    saveIcon?: React.ReactNode;
    savingIcon?: React.ReactNode;
    successIcon?: React.ReactNode;
    errorIcon?: React.ReactNode;
    conflictIcon?: React.ReactNode;
}

export type SaveButtonDisplayState = "idle" | "saving" | "success" | "error" | "conflict";

const SaveBtn = ({
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
    classes,
    disabled,
    ...restProps
}: SaveButtonProps & WithStyles<typeof styles>) => {
    const [displayState, setDisplayState] = React.useState<SaveButtonDisplayState>("idle");
    const saveSplitButton = useSplitButtonContext();

    const resolveIconForDisplayState = (displayState: SaveButtonDisplayState): React.ReactNode => {
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

    React.useEffect(() => {
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

    React.useEffect(() => {
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
        <Button
            {...restProps}
            classes={resolveClassForDisplayState(displayState, classes)}
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
        </Button>
    );
};

const resolveClassForDisplayState = (
    displayState: SaveButtonDisplayState,
    classes: ClassNameMap<ClassKeyOfStyles<SaveButtonClassKey>>,
): ClassNameMap<ClassKeyOfStyles<ButtonClassKey>> => {
    const { success, saving, error, ...buttonClasses } = classes;

    if (displayState === "success") {
        buttonClasses.root += ` ${classes.success}`;
    } else if (displayState === "saving") {
        buttonClasses.root += ` ${classes.saving}`;
    } else if (displayState === "error") {
        buttonClasses.root += ` ${classes.error}`;
    } else if (displayState === "conflict") {
        buttonClasses.root += ` ${classes.conflict}`;
    }

    return buttonClasses;
};

export const SaveButton = withStyles(styles, { name: "CometAdminSaveButton" })(SaveBtn);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminSaveButton: SaveButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminSaveButton: Partial<SaveButtonProps>;
    }

    interface Components {
        CometAdminSaveButton?: {
            defaultProps?: ComponentsPropsList["CometAdminSaveButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminSaveButton"];
        };
    }
}
