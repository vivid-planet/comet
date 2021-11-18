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
export type PromptActionCallback = (action: PromptAction) => Promise<AllowTransition>;

export const RouterPromptHandler: React.FunctionComponent<Props> = ({ children, showDialog, dialogMessage, handleDialogClose }) => {
    const registeredMessages = React.useRef<IMessages>({});
    const promptActions: PromptActionCallback[] = [];

    const register = (
        id: string,
        message: (location: History.Location, action: History.Action) => string | boolean,
        handlePromptAction: PromptActionCallback,
    ) => {
        registeredMessages.current[id] = message;
        promptActions.push(handlePromptAction);
    };

    const unregister = (id: string) => {
        delete registeredMessages.current[id];
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
        const results: Array<AllowTransition> = await Promise.all(promptActions.map((promptAction) => promptAction(action)));
        handleDialogClose(results.every((result) => result));
    };

    return (
        <RouterContext.Provider
            value={{
                register,
                unregister,
            }}
        >
            <RouterConfirmationDialog isOpen={showDialog} message={dialogMessage} handleClose={handleClose} />
            <Prompt when={true} message={promptMessage} />
            {children}
        </RouterContext.Provider>
    );
};
