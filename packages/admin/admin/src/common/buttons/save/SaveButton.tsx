import { Check, Error, Save, ThreeDotSaving } from "@comet/admin-icons";
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
    savingItem?: React.ReactNode;
    successItem?: React.ReactNode;
    errorItem?: React.ReactNode;
    saveIcon?: React.ReactNode;
    savingIcon?: React.ReactNode;
    successIcon?: React.ReactNode;
    errorIcon?: React.ReactNode;
}

export type SaveButtonDisplayState = "idle" | "saving" | "success" | "error";

const SaveBtn = ({
    saving = false,
    hasErrors = false,
    children = <FormattedMessage {...messages.save} />,
    savingItem = <FormattedMessage id="comet.saveButton.savingItem.title" defaultMessage="Saving" />,
    successItem = <FormattedMessage id="comet.saveButton.successItem.title" defaultMessage="Successfully Saved" />,
    errorItem = <FormattedMessage id="comet.saveButton.errorItem.title" defaultMessage="Save Error" />,
    saveIcon = <Save />,
    savingIcon = <ThreeDotSaving />,
    successIcon = <Check />,
    errorIcon = <Error />,
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
        }
        return saveIcon;
    };

    React.useEffect(() => {
        if (displayState === "idle" && saving) {
            setDisplayState("saving");
        }
        // Display Error
        else if (displayState === "saving" && hasErrors === true) {
            setTimeout(() => {
                setDisplayState("error");
                setTimeout(() => {
                    setDisplayState("idle");
                }, 5000);
            }, 500);
        }
        // Display Success
        else if (displayState === "saving" && saving === false && hasErrors === false) {
            setTimeout(() => {
                setDisplayState("success");
                setTimeout(() => {
                    setDisplayState("idle");
                }, 2000);
            }, 500);
        }
    }, [displayState, saving, hasErrors]);

    React.useEffect(() => {
        if (displayState === "idle") {
            saveSplitButton?.setShowSelectButton(undefined);
        } else if (displayState === "saving") {
            saveSplitButton?.setShowSelectButton(false);
        } else if (displayState === "success") {
            saveSplitButton?.setShowSelectButton(false);
        } else if (displayState === "error") {
            saveSplitButton?.setShowSelectButton(false);
        }
    }, [displayState, saveSplitButton]);

    return (
        <Button
            {...restProps}
            classes={resolveClassForDisplayState(displayState, classes)}
            startIcon={resolveIconForDisplayState(displayState)}
            variant={variant}
            color={color}
            disabled={disabled || displayState != "idle"}
        >
            {displayState === "idle" && children}
            {displayState === "saving" && savingItem}
            {displayState === "success" && successItem}
            {displayState === "error" && errorItem}
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
    }

    return buttonClasses;
};

export const SaveButton = withStyles(styles, { name: "CometAdminSaveButton" })(SaveBtn);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminSaveButton: SaveButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminSaveButton: SaveButtonProps;
    }

    interface Components {
        CometAdminSaveButton?: {
            defaultProps?: ComponentsPropsList["CometAdminSaveButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminSaveButton"];
        };
    }
}
