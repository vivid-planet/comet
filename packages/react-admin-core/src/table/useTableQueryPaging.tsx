import * as React from "react";
import { usePersistedState } from "./usePersistedState";

export interface IPagingApi<T> {
    init: T;
    current: T;
    currentPage?: number;
    changePage: (variables: T, page?: number) => void;
    attachTableRef: (ref: React.RefObject<HTMLDivElement | undefined>) => void;
}
export function useTableQueryPaging<T>(
    init: T,
    options: {
        persistedStateId?: string;
    } = {},
): IPagingApi<T> {
    const [page, setPage] = usePersistedState(1, {
        persistedStateId: options.persistedStateId ? options.persistedStateId + "_pagingPage" : undefined,
    });
    const [variables, setVariables] = usePersistedState<T>(init, {
        persistedStateId: options.persistedStateId ? options.persistedStateId + "_pagingVariables" : undefined,
    });

    let tableRef: React.RefObject<HTMLDivElement | undefined> | undefined;
    function attachTableRef(ref: any) {
        tableRef = ref;
    }

    function changePage(vars: T, p?: number) {
        setVariables(vars);
        if (p) setPage(p);
        if (tableRef && tableRef.current) {
            tableRef.current.scrollIntoView();
        }
    }

    return {
        init,
        current: variables,
        currentPage: page,
        changePage,
        attachTableRef,
    };
}
