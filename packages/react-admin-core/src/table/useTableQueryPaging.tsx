import * as React from "react";

export interface IPagingApi<T> {
    current: T;
    currentPage?: number;
    changePage: (variables: T, page?: number) => void;
    attachTableRef: (ref: React.RefObject<HTMLDivElement | undefined>) => void;
}
export function useTableQueryPaging<T>(init: T): IPagingApi<T> {
    const [page, setPage] = React.useState(1);
    const [variables, setVariables] = React.useState<T>(init);

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
        current: variables,
        currentPage: page,
        changePage,
        attachTableRef,
    };
}
