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
    saveActions,
    apiRef,
}: {
    registeredMessages: React.MutableRefObject<PromptMessages>;
    saveActions: React.MutableRefObject<SaveActions>;
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
                //subRoutePath matches with loaciton, allow transition
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
        if (Object.keys(saveActions.current).length > 0 && action === PromptAction.Save) {
            const results: Array<SaveActionSuccess> = await Promise.all(Object.keys(saveActions.current).map((id) => saveActions.current[id]()));
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
                showSaveButton={Object.keys(saveActions.current).length > 0}
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
    };
}
interface Props {
    apiRef: React.MutableRefObject<PromptHandlerApi | undefined>;
}

export type SaveActionSuccess = boolean;
export type SaveAction = (() => Promise<SaveActionSuccess>) | (() => SaveActionSuccess);

interface SaveActions {
    [id: string]: SaveAction;
}

export const RouterPromptHandler: React.FunctionComponent<Props> = ({ children, apiRef }) => {
    const registeredMessages = React.useRef<PromptMessages>({});
    const saveActions = React.useRef<SaveActions>({});

    const register = ({
        id,
        message,
        saveAction,
        path,
        subRoutePath,
    }: {
        id: string;
        message: (location: History.Location, action: History.Action) => string | boolean;
        saveAction: SaveAction;
        path: string;
        subRoutePath?: string;
    }) => {
        registeredMessages.current[id] = { message, path, subRoutePath };
        if (saveAction) {
            saveActions.current[id] = saveAction;
        }
        // If saveAction is passed it has to be passed for all registered components
        const countSaveActions = Object.keys(saveActions.current).length;
        const countRegisteredMessages = Object.keys(registeredMessages.current).length;
        if (countSaveActions > 0 && countSaveActions !== countRegisteredMessages) {
            // eslint-disable-next-line no-console
            console.error(
                "A component (e.g. RouterPrompt) is missing a saveAction-prop. If you fail to do so, the Save-Button in the Dirty-Dialog won't save the changes",
            );
        }
    };

    const unregister = (id: string) => {
        delete registeredMessages.current[id];
        if (saveActions.current[id] !== undefined) delete saveActions.current[id];
    };

    return (
        <RouterContext.Provider
            value={{
                register,
                unregister,
            }}
        >
            {/* inner component not wrapping children contains local state to avoid rerender on state change */}
            <InnerPromptHandler registeredMessages={registeredMessages} saveActions={saveActions} apiRef={apiRef} />
            {children}
        </RouterContext.Provider>
    );
};
