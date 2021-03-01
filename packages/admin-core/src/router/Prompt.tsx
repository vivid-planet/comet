import * as History from "history";
import * as React from "react";
import useConstant from "use-constant";

import { RouterContext } from "./Context";
const UUID = require("uuid");

// react-router Prompt doesn't support multiple Prompts, this one does
interface IProps {
    message: (location: History.Location, action: History.Action) => boolean | string;
}
export const RouterPrompt: React.FunctionComponent<IProps> = ({ message }) => {
    const id = useConstant<string>(() => UUID.v4());
    const context = React.useContext(RouterContext);
    React.useEffect(() => {
        if (context) {
            context.register(id, message);
        }
        return function cleanup() {
            if (context) {
                context.unregister(id);
            }
        };
    });

    return null;
};
