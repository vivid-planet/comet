import { Button } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import * as React from "react";
import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";

import { useSplitButton } from "../../split/useSplitButton";
import { resolveClassForDisplayState, useStyles, useThemeProps } from "./SaveButton.styles";

export interface SaveButtonProps extends ButtonProps {
    saving?: boolean;
    hasErrors?: boolean;
    savingItem?: React.ReactNode;
    successItem?: React.ReactNode;
    errorItem?: React.ReactNode;
}
export type DisplayStateSaveButton = "idle" | "saving" | "success" | "error";

export const SaveButton = ({
    saving = false,
    hasErrors = false,
    children,
    savingItem = <FormattedMessage id={"comet.saveButton.savingItem.title"} defaultMessage={"Saving"} />,
    successItem = <FormattedMessage id={"comet.saveButton.successItem.title"} defaultMessage={"Success Saved"} />,
    errorItem = <FormattedMessage id={"comet.saveButton.errorItem.title"} defaultMessage={"Save Error"} />,
    variant,
    color,
    ...restProps
}: PropsWithChildren<SaveButtonProps>) => {
    const [displayState, setDisplayState] = React.useState<DisplayStateSaveButton>("idle");
    const saveSplitButton = useSplitButton();
    const styles = useStyles({ color });
    const classes = resolveClassForDisplayState(displayState, styles);

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

    const themeProps = useThemeProps();

    return (
        <Button
            {...restProps}
            classes={classes}
            startIcon={themeProps.resolveIconForDisplayState(displayState)}
            variant={variant}
            color={color}
            disabled={displayState != "idle"}
        >
            {displayState === "idle" && children}
            {displayState === "saving" && savingItem}
            {displayState === "success" && successItem}
            {displayState === "error" && errorItem}
        </Button>
    );
};
