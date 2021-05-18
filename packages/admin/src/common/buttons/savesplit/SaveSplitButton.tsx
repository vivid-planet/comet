import { Button } from "@material-ui/core";
import * as React from "react";
import { PropsWithChildren } from "react";
import { useIntl } from "react-intl";

import { SplitButton, SplitButtonProps } from "../split";
import {
    resolveClassForDisplayState,
    resolveIconForDisplayState,
    resolveSaveAndGoBackTextForDisplayState,
    resolveSaveTextForDisplayState,
    resolveShowSelectButton,
} from "./SaveSplitButton.helper";
import { useStyles } from "./SaveSplitButton.styles";

export interface SaveSplitButtonProps extends SplitButtonProps {
    saving?: boolean;
    onSavePressed?: () => void;
    onSaveAndGoBackPressed?: () => void;
    hasErrors?: boolean;
}

export type DisplayStateSaveSplitButton = "idle" | "saving" | "success" | "error";

export const SaveSplitButton = ({
    children,
    saving = false,
    hasErrors = false,
    onSavePressed,
    onSaveAndGoBackPressed,
    disabled,
    ...restProps
}: PropsWithChildren<SaveSplitButtonProps>) => {
    const [displayState, setDisplayState] = React.useState<DisplayStateSaveSplitButton>("idle");

    const intl = useIntl();
    const styles = useStyles();

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

    return (
        <SplitButton
            {...restProps}
            disabled={disabled || displayState !== "idle"}
            showSelectButton={resolveShowSelectButton(displayState)}
            classes={classes}
        >
            {onSavePressed && (
                <Button
                    type="submit"
                    startIcon={resolveIconForDisplayState(displayState)}
                    color={"primary"}
                    variant="contained"
                    onClick={onSavePressed}
                    classes={classes}
                >
                    {intl.formatMessage(resolveSaveTextForDisplayState(displayState)).toUpperCase()}
                </Button>
            )}
            {onSaveAndGoBackPressed && (
                <Button
                    startIcon={resolveIconForDisplayState(displayState)}
                    color={"primary"}
                    variant="contained"
                    onClick={onSaveAndGoBackPressed}
                    classes={classes}
                >
                    {intl.formatMessage(resolveSaveAndGoBackTextForDisplayState(displayState)).toUpperCase()}
                </Button>
            )}
            {children}
        </SplitButton>
    );
};
