import * as React from "react";

export interface IPagingApi<T> {
    current: T;
    currentPage?: number;
    changePage: (variables: T, page?: number) => void;
}
export function useTableQueryPaging<T>(init: T): IPagingApi<T> {
    const [page, setPage] = React.useState(1);
    const [variables, setVariables] = React.useState<T>(init);

    function changePage(vars: T, p?: number) {
        setVariables(vars);
        if (p) setPage(p);
    }

    return {
        current: variables,
        currentPage: page,
        changePage,
    };
}
