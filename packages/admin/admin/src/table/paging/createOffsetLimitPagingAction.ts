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
    const currentPage = pagingApi.currentPage ?? 1;
    const totalPages = Math.ceil(totalCount / limit);

    const createFetchNextPage = () => {
        const nextPage = currentPage + 1;

        if (nextPage <= totalPages) {
            return () => pagingApi.changePage(pagingApi.current + limit, nextPage);
        }
    };
    const createFetchPreviousPage = () => {
        const previousPage = currentPage - 1;
        const newOffset = pagingApi.current - limit >= 0 ? pagingApi.current - limit : 0;

        if (previousPage > 0) {
            return () => pagingApi.changePage(newOffset, previousPage);
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
