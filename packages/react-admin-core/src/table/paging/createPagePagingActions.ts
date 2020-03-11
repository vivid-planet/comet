import { IPagingApi } from "../useTableQueryPaging";
import { IPagingInfo } from "./IPagingInfo";

interface IPagePagingData {
    nextPage: number | null;
    previousPage: number | null;
    totalPages?: number | null;
}

export function createPagePagingActions<TData extends IPagePagingData>(pagingApi: IPagingApi<number>, data: TData): IPagingInfo {
    const nextPage = data.nextPage ? data.nextPage : null;
    const previousPage = data.previousPage ? data.previousPage : null;
    return {
        fetchNextPage: nextPage
            ? () => {
                  pagingApi.changePage(nextPage, nextPage);
              }
            : undefined,
        fetchPreviousPage: previousPage
            ? () => {
                  pagingApi.changePage(previousPage, previousPage);
              }
            : undefined,
        fetchPage: (page: number) => {
            pagingApi.changePage(page, page);
        },
        totalPages: data.totalPages,
        currentPage: pagingApi.currentPage,
        attachTableRef: pagingApi.attachTableRef,
    };
}
