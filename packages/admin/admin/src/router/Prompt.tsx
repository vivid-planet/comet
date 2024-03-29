import * as History from "history";
import * as React from "react";
import { __RouterContext } from "react-router";
import useConstant from "use-constant";
import { v4 as uuid } from "uuid";

import { RouterContext } from "./Context";
import { SaveAction } from "./PromptHandler";
import { SubRoute } from "./SubRoute";

// react-router Prompt doesn't support multiple Prompts, this one does
interface IProps {
    /**
     * Will be called with the next location and action the user is attempting to navigate to.
     * Return a string to show a prompt to the user or true to allow the transition.
     */
    message: (location: History.Location, action: History.Action) => boolean | string;
    saveAction?: SaveAction;
    subRoutePath?: string;
}
export const RouterPrompt: React.FunctionComponent<IProps> = ({ message, saveAction, subRoutePath, children }) => {
    const id = useConstant<string>(() => uuid());
    const reactRouterContext = React.useContext(__RouterContext); // reactRouterContext can be undefined if no router is used, don't fail in that case
    const path: string | undefined = reactRouterContext?.match.path;
    const context = React.useContext(RouterContext);
    React.useEffect(() => {
        if (context) {
            context.register({ id, message, saveAction, path, subRoutePath });
        } else {
            console.error("Can't register RouterPrompt, missing <RouterPromptHandler>");
        }
        return function cleanup() {
            if (context) {
                context.unregister(id);
            }
        };
    });
    if (subRoutePath) {
        return <SubRoute path={subRoutePath}>{children}</SubRoute>;
    } else {
        return <>{children}</>;
    }
};
