import * as React from "react";
import { Prompt } from "react-router";
import { RouterContext } from "./Context";

interface IMessages {
    [id: string]: () => boolean | string;
}

export const RouterPromptHandler: React.FunctionComponent<{}> = ({ children, ...props }) => {
    const registeredMessages = React.useRef<IMessages>({});

    const register = (id: string, message: () => string | boolean) => {
        registeredMessages.current[id] = message;
    };

    const unregister = (id: string) => {
        delete registeredMessages.current[id];
    };

    const promptMessage = (): boolean | string => {
        let ret: boolean | string = true;
        Object.keys(registeredMessages.current).forEach(id => {
            const message = registeredMessages.current[id]();
            if (message !== true) {
                ret = message;
                return false;
            }
        });
        return ret;
    };

    return (
        <RouterContext.Provider
            value={{
                register,
                unregister,
            }}
        >
            <Prompt when={true} message={promptMessage} />
            {children}
        </RouterContext.Provider>
    );
};
