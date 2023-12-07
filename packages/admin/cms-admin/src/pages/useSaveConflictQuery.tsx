import { DocumentNode, QueryOptions, TypedDocumentNode, useApolloClient } from "@apollo/client";
import { LocalErrorScopeApolloContext } from "@comet/admin";

import { SaveConflictHookReturn, useSaveConflict } from "./useSaveConflict";

interface SaveConflictQueryHookOptions<TData, TVariables> extends Omit<QueryOptions<TVariables, TData>, "query"> {
    resolveHasConflict: (query: TData) => boolean;
    skip?: boolean;
}
interface SaveConflictDialogOptions {
    hasChanges: boolean;
    loadLatestVersion: () => Promise<void>;
    onDiscardButtonPressed: () => Promise<void>;
    pageTreeNodeId?: string;
}
export function useSaveConflictQuery<TData, TVariables>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    options: SaveConflictQueryHookOptions<TData, TVariables>,
    dialogOptions: SaveConflictDialogOptions,
): SaveConflictHookReturn {
    const client = useApolloClient();
    const { resolveHasConflict, skip, ...restOptions } = options;
    const checkConflict = async () => {
        if (skip) return false;
        try {
            const { data, error } = await client.query({
                query,
                fetchPolicy: "no-cache",
                context: LocalErrorScopeApolloContext,
                ...restOptions,
            });
            if (error) return false;
            return resolveHasConflict(data);
        } catch (error) {
            return false;
        }
    };
    return useSaveConflict({ checkConflict, ...dialogOptions, hasChanges: () => dialogOptions.hasChanges });
}
