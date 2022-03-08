import { IPagingApi } from "../useTableQueryPaging";
import { IPagingInfo } from "./IPagingInfo";

interface IRestPagingData {
    totalPages: number;
    loadLimit: number;
}

export function createRestStartLimitPagingActions<TData extends IRestPagingData>(pagingApi: IPagingApi<number>, data: TData): IPagingInfo {
    const loadLimit = Math.max(1, data.loadLimit); // min value 1 -> avoid division by zero

    const nextStart = pagingApi.current + loadLimit;
    const previousStart = pagingApi.current - loadLimit;

    const nextPage = nextStart / loadLimit + 1;
    const previousPage = nextStart / loadLimit - 1;

    return {
        fetchNextPage:
            nextPage <= data.totalPages
                ? () => {
                      pagingApi.changePage(nextStart, nextPage);
                  }
                : undefined,
        fetchPreviousPage:
            previousStart >= 0
                ? () => {
                      pagingApi.changePage(previousStart, previousPage);
                  }
                : undefined,
        totalPages: data.totalPages,
        currentPage: pagingApi.currentPage,
        attachTableRef: pagingApi.attachTableRef,
    };
}
