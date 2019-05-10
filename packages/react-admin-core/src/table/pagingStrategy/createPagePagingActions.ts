import { ITableQueryApi } from "../TableQueryContext";
import { IPagingActions } from "./PagingStrategy";

interface IPagePagingData {
    nextPage: number | null;
    previousPage: number | null;
}

export function createPagePagingActions<TData extends IPagePagingData>(data: TData): IPagingActions {
    const nextPage = data.nextPage ? data.nextPage : null;
    const previousPage = data.previousPage ? data.previousPage : null;
    return {
        fetchNextPage: nextPage
            ? (tableQuery: ITableQueryApi) => {
                  tableQuery.changePage({
                      page: nextPage,
                  });
              }
            : undefined,
        fetchPreviousPage: previousPage
            ? (tableQuery: ITableQueryApi) => {
                  tableQuery.changePage({
                      page: previousPage,
                  });
              }
            : undefined,
    };
}
