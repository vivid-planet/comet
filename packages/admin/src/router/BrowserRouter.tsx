import * as React from "react";
import { BrowserRouter as ReactBrowserRouter, BrowserRouterProps } from "react-router-dom";

import { RouterPromptHandler } from "./PromptHandler";

// BrowserRouter that sets up a material-ui confirmation dialog
// plus a PromptHandler that works with our Prompt (supporting multiple Prompts)

interface IState {
    showConfirmationDialog: boolean;
    message: string;
    callback?: (ok: boolean) => void;
}

export const RouterBrowserRouter: React.FunctionComponent<BrowserRouterProps> = ({ children, ...props }) => {
    const [state, setState] = React.useState<IState>({
        showConfirmationDialog: false,
        message: "",
        callback: undefined,
    });
    const getConfirmation = (message: string, callback: (ok: boolean) => void) => {
        setState({
            showConfirmationDialog: true,
            message,
            callback,
        });
    };
    const handleClose = (allowTransition: boolean) => {
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
        <ReactBrowserRouter getUserConfirmation={getConfirmation} {...props}>
            <RouterPromptHandler showDialog={state.showConfirmationDialog} dialogMessage={state.message} handleDialogClose={handleClose}>
                {children}
            </RouterPromptHandler>
        </ReactBrowserRouter>
    );
};
