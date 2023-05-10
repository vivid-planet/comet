import * as React from "react";
import { BrowserRouter as ReactBrowserRouter, BrowserRouterProps } from "react-router-dom";

import { PromptHandlerApi, RouterPromptHandler } from "./PromptHandler";

// BrowserRouter that sets up a material-ui confirmation dialog
// plus a PromptHandler that works with our Prompt (supporting multiple Prompts)

export const RouterBrowserRouter: React.FunctionComponent<BrowserRouterProps> = ({ children, ...props }) => {
    const apiRef = React.useRef<PromptHandlerApi>();

    const getConfirmation = (message: string, callback: (ok: boolean) => void) => {
        if (apiRef.current) {
            apiRef.current.showDialog(message, callback);
        }
    };

    return (
        <ReactBrowserRouter getUserConfirmation={getConfirmation} {...props}>
            <RouterPromptHandler apiRef={apiRef}>{children}</RouterPromptHandler>
        </ReactBrowserRouter>
    );
};
