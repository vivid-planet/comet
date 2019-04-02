import * as React from "react";
import { Prompt } from "react-router";
import Context from "./Context";

interface IMessages {
    [id: string]: () => boolean | string;
}

const PromptHandler: React.FunctionComponent<{}> = ({ children, ...props }) => {
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
        <Context.Provider
            value={{
                register,
                unregister,
            }}
        >
            <Prompt when={true} message={promptMessage} />
            {children}
        </Context.Provider>
    );
};
export default PromptHandler;
