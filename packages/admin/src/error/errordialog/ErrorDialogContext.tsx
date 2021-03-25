import * as React from "react";

import { ErrorDialogOptions } from "./ErrorDialog";

export interface ErrorDialogContextProps {
    showError: (options: ErrorDialogOptions) => void;
}

const ErrorDialogContext = React.createContext<ErrorDialogContextProps>(undefined!);
export { ErrorDialogContext };
