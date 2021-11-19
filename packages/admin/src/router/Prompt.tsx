import * as History from "history";
import * as React from "react";
import useConstant from "use-constant";
import { v4 as uuidv4 } from "uuid";

import { RouterContext } from "./Context";

// react-router Prompt doesn't support multiple Prompts, this one does
interface IProps {
    /**
     * Will be called with the next location and action the user is attempting to navigate to.
     * Return a string to show a prompt to the user or true to allow the transition.
     */
    message: (location: History.Location, action: History.Action) => boolean | string;
    handlePromptAction: PromptActionCallback;
}
export const RouterPrompt: React.FunctionComponent<IProps> = ({ message }) => {
    const id = useConstant<string>(() => uuidv4());
    const context = React.useContext(RouterContext);
    React.useEffect(() => {
        if (context) {
            context.register(id, message, handlePromptAction);
        }
        return function cleanup() {
            if (context) {
                context.unregister(id);
            }
        };
    });

    return null;
};
