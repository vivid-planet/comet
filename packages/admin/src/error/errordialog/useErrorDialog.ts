import * as React from "react";

import { ErrorDialogContext, ErrorDialogContextProps } from "./ErrorDialogContext";

export function useErrorDialog(): ErrorDialogContextProps | undefined {
    return React.useContext(ErrorDialogContext);
}
