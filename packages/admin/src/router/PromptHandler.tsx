import * as History from "history";
import * as React from "react";
import { Prompt } from "react-router";

import { PromptAction, RouterConfirmationDialog } from "./ConfirmationDialog";
import { RouterContext } from "./Context";

interface IMessages {
    [id: string]: (location: History.Location, action: History.Action) => boolean | string;
}
interface Props {
    showDialog: boolean;
    dialogMessage: string;
    handleDialogClose: (ok: boolean) => void;
}

export type AllowTransition = boolean;
export type PromptActionCallback = (action: PromptAction) => Promise<AllowTransition> | AllowTransition;
interface PromptActionsCallbacks {
    [id: string]: PromptActionCallback;
}

export const RouterPromptHandler: React.FunctionComponent<Props> = ({ children, showDialog, dialogMessage, handleDialogClose }) => {
    const registeredMessages = React.useRef<IMessages>({});
    const promptActions = React.useRef<PromptActionsCallbacks>({});

    const register = (
        id: string,
        message: (location: History.Location, action: History.Action) => string | boolean,
        handlePromptAction: PromptActionCallback,
    ) => {
        registeredMessages.current[id] = message;
        if (handlePromptAction) {
            promptActions.current[id] = handlePromptAction;
        }
        // If handlePromptAction is passed it has to be passed for all registered components
        const countPromptActions = Object.keys(promptActions.current).length;
        const countRegisteredMessages = Object.keys(registeredMessages.current).length;
        if (countPromptActions > 0 && countPromptActions !== countRegisteredMessages) {
            console.error(
                "A component (e.g. RouterPrompt) is missing a handlePromptAction-prop. If you fail to do so, the Save-Button in the Dirty-Dialog won't save the changes",
            );
        }
    };

    const unregister = (id: string) => {
        delete registeredMessages.current[id];
        if (promptActions.current[id] !== undefined) delete promptActions.current[id];
    };

    const promptMessage = (location: History.Location, action: History.Action): boolean | string => {
        let ret: boolean | string = true;
        Object.keys(registeredMessages.current).forEach((id) => {
            const message = registeredMessages.current[id](location, action);
            if (message !== true) {
                ret = message;
                return false;
            }
        });
        return ret;
    };

    const handleClose = async (action: PromptAction) => {
        if (Object.keys(promptActions.current).length > 0) {
            const results: Array<AllowTransition> = await Promise.all(
                Object.keys(promptActions.current).map((id) => promptActions.current[id](action)),
            );
            handleDialogClose(results.every((result) => result));
        } else {
            handleDialogClose(action === PromptAction.Discard);
        }
    };

    return (
        <RouterContext.Provider
            value={{
                register,
                unregister,
            }}
        >
            <RouterConfirmationDialog
                isOpen={showDialog}
                message={dialogMessage}
                handleClose={handleClose}
                showSaveButton={Object.keys(promptActions.current).length > 0}
            />
            <Prompt when={true} message={promptMessage} />
            {children}
        </RouterContext.Provider>
    );
};
