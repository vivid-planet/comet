import { type MutableRefObject, type PropsWithChildren, useCallback, useRef, useState } from "react";
import { type Location, matchPath, type NavigationType, useBlocker } from "react-router";

import { PromptAction, RouterConfirmationDialog } from "./ConfirmationDialog";
import { RouterContext } from "./Context";
import { type PromptRoutes } from "./Prompt";

interface PromptHandlerState {
    showConfirmationDialog: boolean;
    message: string;
}
export interface PromptHandlerApi {
    showDialog: (message: string, callback: (ok: boolean) => void) => void;
}
function InnerPromptHandler({
    registeredMessages,
    apiRef,
}: {
    registeredMessages: MutableRefObject<PromptMessages>;
    apiRef: MutableRefObject<PromptHandlerApi | undefined>;
}) {
    const [state, setState] = useState<PromptHandlerState>({
        showConfirmationDialog: false,
        message: "",
    });
    const blockerMessageRef = useRef<string>("");

    if (apiRef)
        apiRef.current = {
            showDialog: (message: string, callback: (ok: boolean) => void) => {
                setState({
                    showConfirmationDialog: true,
                    message,
                });
            },
        };

    const shouldBlock = useCallback(
        ({ nextLocation, historyAction }: { nextLocation: Location; historyAction: NavigationType }): boolean => {
            for (const id of Object.keys(registeredMessages.current)) {
                const path = registeredMessages.current[id].path;
                const subRoutePath = registeredMessages.current[id].subRoutePath;
                const promptRoutes = registeredMessages.current[id].promptRoutes?.current ?? {};

                const promptRouteMatches = Object.values(promptRoutes).some((route) => {
                    return matchPath({ path: route.path, end: true }, nextLocation.pathname);
                });
                const subRouteMatches = subRoutePath && nextLocation.pathname.startsWith(subRoutePath);
                const pathMatches = matchPath({ path, end: true }, nextLocation.pathname);

                if (promptRouteMatches || (!subRouteMatches && !pathMatches)) {
                    const message = registeredMessages.current[id].message(nextLocation, historyAction);
                    if (message !== true) {
                        blockerMessageRef.current = typeof message === "string" ? message : "";
                        return true;
                    }
                }
            }
            return false;
        },
        [registeredMessages],
    );

    const blocker = useBlocker(shouldBlock);

    const handleClose = async (action: PromptAction) => {
        let allowTransition = false;
        const saveActions = Object.values(registeredMessages.current)
            .filter((registeredMessage) => !!registeredMessage.saveAction)
            .map((registeredMessage) => registeredMessage.saveAction);
        if (action === PromptAction.Save) {
            if (saveActions.length > 0) {
                const results: Array<SaveActionSuccess> = await Promise.all(saveActions.map((saveAction) => saveAction!()));
                allowTransition = results.every((saveActionSuccess) => saveActionSuccess);
            } else {
                allowTransition = true;
            }
        } else if (action === PromptAction.Discard) {
            allowTransition = true;
            for (const msg of Object.values(registeredMessages.current)) {
                msg.resetAction?.();
            }
        }
        if (allowTransition && blocker.state === "blocked") {
            blocker.proceed();
        } else if (blocker.state === "blocked") {
            blocker.reset();
        }
        setState({
            showConfirmationDialog: false,
            message: "",
        });
    };

    const isBlocked = blocker.state === "blocked";

    return (
        <RouterConfirmationDialog
            isOpen={isBlocked || state.showConfirmationDialog}
            message={isBlocked ? blockerMessageRef.current : state.message}
            handleClose={handleClose}
            showSaveButton={Object.values(registeredMessages.current).some((registeredMessage) => !!registeredMessage.saveAction)}
        />
    );
}

interface PromptMessages {
    [id: string]: {
        message: (location: Location, action: NavigationType) => boolean | string;
        path: string;
        subRoutePath?: string;
        saveAction?: SaveAction;
        resetAction?: ResetAction;
        promptRoutes?: MutableRefObject<PromptRoutes>;
    };
}
interface Props {
    apiRef: MutableRefObject<PromptHandlerApi | undefined>;
}

type SaveActionSuccess = boolean;
export type SaveAction = (() => Promise<SaveActionSuccess>) | (() => SaveActionSuccess);
export type ResetAction = () => void;

export const RouterPromptHandler = function ({ children, apiRef }: PropsWithChildren<Props>) {
    const registeredMessages = useRef<PromptMessages>({});

    const register = ({
        id,
        message,
        saveAction,
        resetAction,
        path,
        subRoutePath,
        promptRoutes,
    }: {
        id: string;
        message: (location: Location, action: NavigationType) => string | boolean;
        saveAction?: SaveAction;
        resetAction?: ResetAction;
        path: string;
        subRoutePath?: string;
        promptRoutes?: MutableRefObject<PromptRoutes>;
    }) => {
        registeredMessages.current[id] = { message, path, subRoutePath, saveAction, resetAction, promptRoutes };
        // If saveAction is passed it has to be passed for all registered components
        if (saveAction && Object.values(registeredMessages.current).some((registeredMessage) => !registeredMessage.saveAction)) {
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
