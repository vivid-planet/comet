import { useApolloClient, useQuery } from "@apollo/client";
import { ApolloCache } from "@apollo/client/cache";
import { DocumentNode, OperationVariables, TypedDocumentNode } from "@apollo/client/core";
import { QueryHookOptions, QueryResult } from "@apollo/client/react/types/types";

interface UseQueryWithFragmentCacheOptions<TData = unknown, TVariables = OperationVariables> extends QueryHookOptions<TData, TVariables> {
    // Apollo uses ApolloCache<object> internally, therefore I must use object too
    optimisticResponse: (cache: ApolloCache<object>) => TData | undefined;
}

export const useOptimisticQuery = <TData, TVariables>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    options?: UseQueryWithFragmentCacheOptions<TData, TVariables>,
): QueryResult<TData, TVariables> => {
    const client = useApolloClient();

    const queryResult = useQuery<TData, TVariables>(query, options);

    let dataFromCache: TData | undefined = undefined;
    if (queryResult.data === undefined) {
        dataFromCache = options?.optimisticResponse(client.cache);
    }

    return { ...queryResult, data: queryResult.data ?? dataFromCache };
};
