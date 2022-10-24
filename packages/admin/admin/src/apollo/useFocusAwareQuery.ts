import { DocumentNode, OperationVariables, QueryHookOptions, QueryResult, TypedDocumentNode, useQuery } from "@apollo/client";
import { useEffect } from "react";

function useFocusAwareQuery<TData = any, TVariables = OperationVariables>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    options?: QueryHookOptions<TData, TVariables>,
): QueryResult<TData, TVariables> {
    const queryResult = useQuery<TData, TVariables>(query, options);

    const pollInterval = options?.pollInterval;
    const { refetch, startPolling, stopPolling } = queryResult;

    useEffect(() => {
        if (pollInterval === undefined) {
            return;
        }

        const handleFocus = () => {
            refetch();

            startPolling(pollInterval);
        };

        const handleBlur = () => {
            stopPolling();
        };

        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);

        return () => {
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
        };
    }, [pollInterval, refetch, startPolling, stopPolling]);

    return queryResult;
}

export { useFocusAwareQuery };
