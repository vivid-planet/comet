import * as React from "react";

import { ErrorDialogOptions } from "./ErrorDialog";
import { errorDialogVar } from "./errorDialogVar";

export interface UseErrorDialogReturn {
    showError: (options: ErrorDialogOptions) => void;
}

export function useErrorDialog(): UseErrorDialogReturn | undefined {
    const showError = React.useCallback((options: ErrorDialogOptions) => {
        errorDialogVar(options);
    }, []);
    return { showError };
}
