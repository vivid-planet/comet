import { IPagingApi } from "../useTableQueryPaging";
import { IPagingInfo } from "./IPagingInfo";

interface OffsetLimitPagingData {
    totalCount: number;
}

export function createOffsetLimitPagingAction<TData extends OffsetLimitPagingData>(
    pagingApi: IPagingApi<number>,
    { totalCount }: TData,
    limit: number,
): IPagingInfo {
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.floor(pagingApi.current / limit) + 1;
    pagingApi.changePage(currentPage);

    const createFetchNextPage = () => {
        const nextPage = currentPage + 1;

        if (nextPage <= totalPages) {
            return () => pagingApi.changePage(pagingApi.current + limit, nextPage);
        }
    };
    const createFetchPreviousPage = () => {
        const previousPage = currentPage - 1;

        if (previousPage > 0) {
            return () => pagingApi.changePage(pagingApi.current - limit, previousPage);
        }
    };

    return {
        fetchNextPage: createFetchNextPage(),
        fetchPreviousPage: createFetchPreviousPage(),
        totalPages,
        currentPage,
        attachTableRef: pagingApi.attachTableRef,
    };
}
