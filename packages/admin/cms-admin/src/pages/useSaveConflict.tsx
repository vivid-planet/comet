import { useSnackbarApi } from "@comet/admin";
import { Alert, Snackbar } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { SaveConflictDialog } from "./SaveConflictDialog";

export interface SaveConflictOptions {
    checkConflict: () => Promise<boolean>;
    hasChanges: () => boolean;
    loadLatestVersion: () => Promise<void>;
    onDiscardButtonPressed: () => Promise<void>;
}

export interface SaveConflictHookReturn {
    dialogs: React.ReactNode;
    checkForConflicts: () => Promise<boolean>;
    hasConflict: boolean;
}

export function useSaveConflict(options: SaveConflictOptions): SaveConflictHookReturn {
    const { checkConflict, hasChanges, loadLatestVersion, onDiscardButtonPressed } = options;
    const snackbarApi = useSnackbarApi();
    const pollingIntervalId = React.useRef<number | undefined>();

    const [showDialog, setShowDialog] = React.useState(false);
    const [hasConflict, setHasConflict] = React.useState(false);

    const checkChanges = React.useCallback(async () => {
        const newHasConflict = await checkConflict();
        //we don't need setHasConflict as that is used during save only
        if (newHasConflict) {
            if (!hasChanges()) {
                // No local changes, server changes available
                await loadLatestVersion();
                snackbarApi.showSnackbar(
                    <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "left" }} autoHideDuration={5000}>
                        <Alert severity="success">
                            <FormattedMessage
                                id="comet.saveConflict.autoReloadSuccessfull"
                                defaultMessage="This content has changed. We've refreshed the page for you."
                            />
                        </Alert>
                    </Snackbar>,
                );
            } else {
                // local changes, and server changes available: ask user what to do
                if (!hasConflict) {
                    setShowDialog(true);
                }
                setHasConflict(true);
            }
        } else {
            setShowDialog(false);
            setHasConflict(false);
        }
    }, [checkConflict, hasChanges, hasConflict, loadLatestVersion, snackbarApi]);

    const startPolling = React.useCallback(() => {
        if (!hasConflict) {
            pollingIntervalId.current = window.setInterval(checkChanges, 10000);
        }
    }, [checkChanges, hasConflict]);

    const stopPolling = React.useCallback(() => {
        if (pollingIntervalId !== undefined) {
            window.clearInterval(pollingIntervalId.current);
            pollingIntervalId.current = undefined;
        }
    }, []);

    React.useEffect(() => {
        const handleFocus = () => {
            if (!hasConflict) {
                checkChanges();
            }
            startPolling();
        };

        const handleBlur = () => {
            stopPolling();
        };

        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);

        if (document.hasFocus()) {
            startPolling();
        }

        return () => {
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);

            stopPolling();
        };
    }, [checkConflict, snackbarApi, loadLatestVersion, hasChanges, checkChanges, startPolling, stopPolling, hasConflict]);

    const checkForConflicts = React.useCallback(async () => {
        const newHasConflict = await checkConflict();
        if (newHasConflict) {
            setShowDialog(true);
            setHasConflict(true);
        }
        return newHasConflict;
    }, [checkConflict]);

    return {
        checkForConflicts,
        hasConflict,
        dialogs: (
            <>
                <SaveConflictDialog
                    open={showDialog}
                    onClosePressed={() => {
                        stopPolling();
                        setShowDialog(false);
                    }}
                    onDiscardChangesPressed={() => {
                        setHasConflict(false);
                        setShowDialog(false);
                        onDiscardButtonPressed();
                    }}
                />
            </>
        ),
    };
}
