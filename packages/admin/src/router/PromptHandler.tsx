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

export type SaveActionSuccess = boolean;
export type SaveAction = (() => Promise<SaveActionSuccess>) | (() => SaveActionSuccess);

interface SaveActions {
    [id: string]: SaveAction;
}

export const RouterPromptHandler: React.FunctionComponent<Props> = ({ children, showDialog, dialogMessage, handleDialogClose }) => {
    const registeredMessages = React.useRef<IMessages>({});
    const saveActions = React.useRef<SaveActions>({});

    const register = (id: string, message: (location: History.Location, action: History.Action) => string | boolean, saveAction: SaveAction) => {
        registeredMessages.current[id] = message;
        if (saveAction) {
            saveActions.current[id] = saveAction;
        }
        // If saveAction is passed it has to be passed for all registered components
        const countSaveActions = Object.keys(saveActions.current).length;
        const countRegisteredMessages = Object.keys(registeredMessages.current).length;
        if (countSaveActions > 0 && countSaveActions !== countRegisteredMessages) {
            console.error(
                "A component (e.g. RouterPrompt) is missing a saveAction-prop. If you fail to do so, the Save-Button in the Dirty-Dialog won't save the changes",
            );
        }
    };

    const unregister = (id: string) => {
        delete registeredMessages.current[id];
        if (saveActions.current[id] !== undefined) delete saveActions.current[id];
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
        if (Object.keys(saveActions.current).length > 0 && action === PromptAction.Save) {
            const results: Array<SaveActionSuccess> = await Promise.all(Object.keys(saveActions.current).map((id) => saveActions.current[id]()));
            handleDialogClose(results.every((saveActionSuccess) => saveActionSuccess));
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
                showSaveButton={Object.keys(saveActions.current).length > 0}
            />
            <Prompt when={true} message={promptMessage} />
            {children}
        </RouterContext.Provider>
    );
};
