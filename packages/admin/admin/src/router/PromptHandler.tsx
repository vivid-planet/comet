import * as History from "history";
import * as React from "react";
import { matchPath, Prompt } from "react-router";

import { PromptAction, RouterConfirmationDialog } from "./ConfirmationDialog";
import { RouterContext } from "./Context";

interface PromptHandlerState {
    showConfirmationDialog: boolean;
    message: string;
    callback?: (ok: boolean) => void;
}
export interface PromptHandlerApi {
    showDialog: (message: string, callback: (ok: boolean) => void) => void;
}
function InnerPromptHandler({
    registeredMessages,
    apiRef,
}: {
    registeredMessages: React.MutableRefObject<PromptMessages>;
    apiRef: React.MutableRefObject<PromptHandlerApi | undefined>;
}) {
    const [state, setState] = React.useState<PromptHandlerState>({
        showConfirmationDialog: false,
        message: "",
        callback: undefined,
    });
    if (apiRef)
        apiRef.current = {
            showDialog: (message: string, callback: (ok: boolean) => void) => {
                setState({
                    showConfirmationDialog: true,
                    message,
                    callback,
                });
            },
        };

    const promptMessage = (location: History.Location, action: History.Action): boolean | string => {
        for (const id of Object.keys(registeredMessages.current)) {
            const path = registeredMessages.current[id].path;
            const subRoutePath = registeredMessages.current[id].subRoutePath;
            // allow transition if location is below path where prompt was rendered
            if (subRoutePath && location.pathname.startsWith(subRoutePath)) {
                //subRoutePath matches with location, allow transition
            } else if (matchPath(location.pathname, { path, exact: true })) {
                // path matches with location, allow transition
            } else {
                const message = registeredMessages.current[id].message(location, action);
                if (message !== true) {
                    return message;
                }
            }
        }
        return true;
    };

    const handleClose = async (action: PromptAction) => {
        let allowTransition: boolean;
        const saveActions = Object.values(registeredMessages.current)
            .filter((registeredMessage) => !!registeredMessage.saveAction)
            .map((registeredMessage) => registeredMessage.saveAction);
        if (saveActions.length > 0 && action === PromptAction.Save) {
            const results: Array<SaveActionSuccess> = await Promise.all(saveActions.map((saveAction) => saveAction!()));
            allowTransition = results.every((saveActionSuccess) => saveActionSuccess);
        } else {
            allowTransition = action === PromptAction.Discard;
        }
        if (state.callback) {
            state.callback(allowTransition);
        }
        setState({
            showConfirmationDialog: false,
            message: "",
            callback: undefined,
        });
    };

    return (
        <>
            <RouterConfirmationDialog
                isOpen={state.showConfirmationDialog}
                message={state.message}
                handleClose={handleClose}
                showSaveButton={Object.values(registeredMessages.current).some((registeredMessage) => !!registeredMessage.saveAction)}
            />
            <Prompt when={true} message={promptMessage} />
        </>
    );
}

interface PromptMessages {
    [id: string]: {
        message: (location: History.Location, action: History.Action) => boolean | string;
        path: string;
        subRoutePath?: string;
        saveAction?: SaveAction;
    };
}
interface Props {
    apiRef: React.MutableRefObject<PromptHandlerApi | undefined>;
}

export type SaveActionSuccess = boolean;
export type SaveAction = (() => Promise<SaveActionSuccess>) | (() => SaveActionSuccess);

export const RouterPromptHandler: React.FunctionComponent<Props> = ({ children, apiRef }) => {
    const registeredMessages = React.useRef<PromptMessages>({});

    const register = ({
        id,
        message,
        saveAction,
        path,
        subRoutePath,
    }: {
        id: string;
        message: (location: History.Location, action: History.Action) => string | boolean;
        saveAction?: SaveAction;
        path: string;
        subRoutePath?: string;
    }) => {
        registeredMessages.current[id] = { message, path, subRoutePath, saveAction };
        // If saveAction is passed it has to be passed for all registered components
        if (saveAction && Object.values(registeredMessages.current).some((registeredMessage) => !registeredMessage.saveAction)) {
            // eslint-disable-next-line no-console
            console.error(
                "A component (e.g. RouterPrompt) is missing a saveAction-prop. If you fail to do so, the Save-Button in the Dirty-Dialog won't save the changes",
            );
        }
    };

    const unregister = (id: string) => {
        delete registeredMessages.current[id];
    };

    return (
        <RouterContext.Provider
            value={{
                register,
                unregister,
            }}
        >
            {/* inner component not wrapping children contains local state to avoid rerender on state change */}
            <InnerPromptHandler registeredMessages={registeredMessages} apiRef={apiRef} />
            {children}
        </RouterContext.Provider>
    );
};
