import * as React from "react";
import { BrowserRouter, BrowserRouterProps } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog";
import PromptHandler from "./PromptHandler";

// BrowserRouter that sets up a material-ui confirmation dialog
// plus a PromptHandler that works with our Prompt (supporting multiple Prompts)

interface IState {
    showConfirmationDialog: boolean;
    message: string;
    callback?: (ok: boolean) => void;
}
const VividBrowserRouter: React.FunctionComponent<BrowserRouterProps> = ({ children, ...props }) => {
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
        <BrowserRouter getUserConfirmation={getConfirmation} {...props}>
            <PromptHandler>
                {children}
                <ConfirmationDialog isOpen={state.showConfirmationDialog} message={state.message} handleClose={handleClose} />
            </PromptHandler>
        </BrowserRouter>
    );
};

export default VividBrowserRouter;
