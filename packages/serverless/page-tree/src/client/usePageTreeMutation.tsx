import { Alert, useSnackbarApi } from "@dextinity/admin";
import { getErrorMessage } from "@dextinity/serverless-core/client";
import { Snackbar } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { pageTreeQueryKeys } from "./pageTreeApi.types.js";

/** Refreshes the page tree after the mutation and shows its error in a snackbar */
export function usePageTreeMutation<TVariables>(mutationFn: (variables: TVariables) => Promise<unknown>) {
    const queryClient = useQueryClient();
    const snackbarApi = useSnackbarApi();

    return useMutation({
        mutationFn,
        onSettled: () => queryClient.invalidateQueries({ queryKey: pageTreeQueryKeys.all }),
        onError: (error) =>
            snackbarApi.showSnackbar(
                <Snackbar autoHideDuration={6000}>
                    <Alert severity="error">{getErrorMessage(error)}</Alert>
                </Snackbar>,
            ),
    });
}
