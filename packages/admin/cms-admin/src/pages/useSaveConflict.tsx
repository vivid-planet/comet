import { useLazyQuery } from "@apollo/client";
import { LazyQueryHookOptions } from "@apollo/client/react/types/types";
import { useSnackbarApi } from "@comet/admin";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { Alert, Snackbar } from "@mui/material";
import { DocumentNode } from "graphql";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { SaveConflictDialog } from "./SaveConflictDialog";

interface SaveConflictHookOptions<TData, TVariables> extends LazyQueryHookOptions<TData, TVariables> {
    resolveHasConflict: (query: TData) => boolean;
    skip?: boolean;
}

interface SaveConflictDialogOptions {
    hasChanges: boolean;
    loadLatestVersion: () => Promise<void>;
    onDiscardButtonPressed: () => Promise<void>;
}

interface SaveConflictHookReturn {
    hasConflict: boolean;
    loading: boolean;
    dialogs: React.ReactNode;
    checkForConflicts: () => Promise<boolean>;
}

export function useSaveConflict<TData, TVariables>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    options: SaveConflictHookOptions<TData, TVariables>,
    dialogOptions: SaveConflictDialogOptions,
): SaveConflictHookReturn {
    const { hasChanges, loadLatestVersion, onDiscardButtonPressed } = dialogOptions;
    const { resolveHasConflict, ...restOptions } = options;
    const snackbarApi = useSnackbarApi();

    const [loading, setLoading] = React.useState(false);
    const [showDialog, setShowDialog] = React.useState(false);
    const [hasConflict, setHasConflict] = React.useState(false);

    const [lazyQuery, { data, refetch: checkForChangeRefetch }] = useLazyQuery<TData, TVariables>(query, {
        ...restOptions,
        fetchPolicy: "no-cache",
    });

    const loadLatestVersionAsync = React.useCallback(async () => {
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
    }, [loadLatestVersion, snackbarApi]);

    React.useEffect(() => {
        if (hasConflict) {
            // No local changes, server changes available
            if (!hasChanges) {
                loadLatestVersionAsync();
            }
            // local changes, and serve changes available
            else {
                setShowDialog(true);
            }
        } else {
            setShowDialog(false);
        }
    }, [hasChanges, hasConflict, loadLatestVersionAsync]);

    React.useEffect(() => {
        if (data != null) {
            const resolvedHasConflict = resolveHasConflict(data);
            if (resolvedHasConflict != hasConflict) {
                setHasConflict(resolvedHasConflict);
            }
        }
    }, [hasConflict, data, resolveHasConflict]);

    React.useEffect(() => {
        if (!options.skip) {
            const interval = setInterval(async () => {
                await lazyQuery();
            }, 10000);
            return () => {
                clearInterval(interval);
            };
        }
    }, [lazyQuery, options.skip]);

    const checkForConflicts = React.useCallback(async () => {
        setLoading(true);
        setHasConflict(false);
        const result = await checkForChangeRefetch?.();
        setLoading(false);

        if (result?.data != null) {
            const resolvedConflict = resolveHasConflict(result.data);
            if (resolvedConflict != hasConflict) {
                setHasConflict(resolvedConflict);
            }
            return resolvedConflict;
        }
        return false;
    }, [checkForChangeRefetch, hasConflict, resolveHasConflict]);
    return {
        hasConflict,
        loading,
        checkForConflicts,
        dialogs: (
            <>
                <SaveConflictDialog
                    open={showDialog}
                    onClosePressed={() => {
                        setShowDialog(false);
                    }}
                    onDiscardChangesPressed={() => {
                        setHasConflict(false);
                        onDiscardButtonPressed();
                    }}
                />
            </>
        ),
    };
}
