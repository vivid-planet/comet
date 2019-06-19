import { ITableQueryApi } from "../TableQueryContext";
import { IPagingInfo } from "./PagingStrategy";

interface IPagePagingData {
    nextPage: number | null;
    previousPage: number | null;
    totalPages?: number;
}

export function createPagePagingActions<TData extends IPagePagingData>(data: TData): IPagingInfo {
    const nextPage = data.nextPage ? data.nextPage : null;
    const previousPage = data.previousPage ? data.previousPage : null;
    return {
        fetchNextPage: nextPage
            ? (tableQuery: ITableQueryApi) => {
                  tableQuery.changePage(
                      {
                          page: nextPage,
                      },
                      nextPage,
                  );
              }
            : undefined,
        fetchPreviousPage: previousPage
            ? (tableQuery: ITableQueryApi) => {
                  tableQuery.changePage(
                      {
                          page: previousPage,
                      },
                      previousPage,
                  );
              }
            : undefined,
        totalPages: data.totalPages,
    };
}
