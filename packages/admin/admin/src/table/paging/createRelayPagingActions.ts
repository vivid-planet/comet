import { IPagingApi } from "../useTableQueryPaging";
import { IPagingInfo } from "./IPagingInfo";

interface IRelayPagingData<Cursor> {
    pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: Cursor;
        endCursor: Cursor;
    };
}
export interface IRelayPagingVariables<Cursor> {
    after?: Cursor;
    before?: Cursor;
}
export function createRelayPagingActions<TData extends IRelayPagingData<Cursor>, Cursor = string>(
    pagingApi: IPagingApi<IRelayPagingVariables<Cursor>>,
    data: TData,
): IPagingInfo {
    return {
        fetchNextPage:
            data.pageInfo && data.pageInfo.hasNextPage
                ? () => {
                      pagingApi.changePage({
                          after: data.pageInfo.endCursor,
                      });
                  }
                : undefined,
        fetchPreviousPage:
            data.pageInfo && data.pageInfo.hasPreviousPage
                ? () => {
                      pagingApi.changePage({
                          before: data.pageInfo.startCursor,
                      });
                  }
                : undefined,
        currentPage: pagingApi.currentPage,
        attachTableRef: pagingApi.attachTableRef,
    };
}
