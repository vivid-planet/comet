import * as History from "history";
import * as React from "react";
import { __RouterContext } from "react-router";
import useConstant from "use-constant";
import { v4 as uuid } from "uuid";

import { RouterContext } from "./Context";
import { ResetAction, SaveAction } from "./PromptHandler";
import { SubRoute, useSubRoutePrefix } from "./SubRoute";

type PromptRoute = {
    path: string;
};
export type PromptRoutes = Record<string, PromptRoute>;
interface PromptContext {
    register: (id: string, path: string) => void;
    unregister: (id: string) => void;
}
export const PromptContext = React.createContext<PromptContext | undefined>(undefined);

// react-router Prompt doesn't support multiple Prompts, this one does
interface IProps {
    /**
     * Will be called with the next location and action the user is attempting to navigate to.
     * Return a string to show a prompt to the user or true to allow the transition.
     */
    message: (location: History.Location, action: History.Action) => boolean | string;
    saveAction?: SaveAction;
    resetAction?: ResetAction;
    subRoutePath?: string;
}
export const RouterPrompt: React.FunctionComponent<IProps> = ({ message, saveAction, resetAction, subRoutePath, children }) => {
    const id = useConstant<string>(() => uuid());
    const reactRouterContext = React.useContext(__RouterContext); // reactRouterContext can be undefined if no router is used, don't fail in that case
    const path: string | undefined = reactRouterContext?.match?.path;
    const context = React.useContext(RouterContext);
    const subRoutePrefix = useSubRoutePrefix();
    const promptRoutes = React.useRef<PromptRoutes>({});
    if (subRoutePath && subRoutePath.startsWith("./")) {
        subRoutePath = subRoutePrefix + subRoutePath.substring(1);
    }
    React.useEffect(() => {
        if (context) {
            context.register({ id, message, saveAction, resetAction, path, subRoutePath, promptRoutes });
        } else {
            console.error("Can't register RouterPrompt, missing <RouterPromptHandler>");
        }
        return function cleanup() {
            if (context) {
                context.unregister(id);
            }
        };
    });
    const childrenWithSubRoute = subRoutePath ? <SubRoute path={subRoutePath}>{children}</SubRoute> : children;
    return (
        <PromptContext.Provider
            value={{
                register: (id: string, path: string) => {
                    promptRoutes.current[id] = { path };
                },
                unregister: (id: string) => {
                    delete promptRoutes.current[id];
                },
            }}
        >
            {childrenWithSubRoute}
        </PromptContext.Provider>
    );
};
