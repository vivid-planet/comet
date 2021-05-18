import { ClassNameMap } from "@material-ui/styles/withStyles/withStyles";
import { defineMessage, MessageDescriptor } from "react-intl";

import { DisplayStateSaveSplitButton } from "./SaveSplitButton";
import { useStyles } from "./SaveSplitButton.styles";

export const resolveClassForDisplayState = (
    displayState: DisplayStateSaveSplitButton,
    styles: ReturnType<typeof useStyles>,
): Partial<ClassNameMap<string>> => {
    let rootClass = undefined;

    if (displayState === "success") {
        rootClass = styles.success;
    } else if (displayState === "saving") {
        rootClass = styles.saving;
    } else if (displayState === "error") {
        rootClass = styles.error;
    }
    return {
        root: rootClass,
        disabled: styles.disabled,
    };
};

export const resolveSaveTextForDisplayState = (displayState: DisplayStateSaveSplitButton): MessageDescriptor => {
    if (displayState === "saving") {
        return defineMessage({
            id: "comet.generic.saving",
            defaultMessage: "Saving",
        });
    } else if (displayState === "success") {
        return defineMessage({
            id: "comet.generic.save_successful",
            defaultMessage: "Success Saved",
        });
    } else if (displayState === "error") {
        return defineMessage({
            id: "comet.generic.save_error",
            defaultMessage: "Save Error",
        });
    }
    return defineMessage({
        id: "comet.generic.save",
        defaultMessage: "Save",
    });
};

export const resolveShowSelectButton = (displayState: DisplayStateSaveSplitButton): boolean | undefined => {
    if (displayState !== "idle") {
        return false;
    }
    return undefined;
};

export const resolveSaveAndGoBackTextForDisplayState = (displayState: DisplayStateSaveSplitButton): MessageDescriptor => {
    if (displayState === "saving") {
        return defineMessage({
            id: "comet.generic.saving",
            defaultMessage: "Saving",
        });
    } else if (displayState === "success") {
        return defineMessage({
            id: "comet.generic.save_successful",
            defaultMessage: "Success Saved",
        });
    } else if (displayState === "error") {
        return defineMessage({
            id: "comet.generic.save_error",
            defaultMessage: "Save Error",
        });
    }
    return defineMessage({
        id: "comet.generic.saveAndGoBack",
        defaultMessage: "Save and Go Back",
    });
};
