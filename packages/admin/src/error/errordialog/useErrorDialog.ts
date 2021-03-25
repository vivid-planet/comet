import * as React from "react";

import { ErrorDialogContext, ErrorDialogContextProps } from "./ErrorDialogContext";

export function useErrorDialog(): ErrorDialogContextProps {
    return React.useContext(ErrorDialogContext);
}
