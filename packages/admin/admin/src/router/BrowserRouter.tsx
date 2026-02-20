import { useRef } from "react";
import { BrowserRouter as ReactBrowserRouter, type BrowserRouterProps } from "react-router-dom";

import { type PromptHandlerApi, RouterPromptHandler } from "./PromptHandler";

// BrowserRouter that sets up a material-ui confirmation dialog
// plus a PromptHandler that works with our Prompt (supporting multiple Prompts)

export const RouterBrowserRouter = ({ children, ...props }: BrowserRouterProps) => {
    const apiRef = useRef<PromptHandlerApi>();

    return (
        <ReactBrowserRouter {...props}>
            <RouterPromptHandler apiRef={apiRef}>{children}</RouterPromptHandler>
        </ReactBrowserRouter>
    );
};
