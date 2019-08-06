import { IPagingApi } from "../useTableQueryPaging";
import { IPagingInfo } from "./IPagingInfo";

interface IRelayPagingData {
    pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
    };
}
interface IRelayPagingVariables {
    after?: string;
    before?: string;
}
export function createRelayPagingActions<TData extends IRelayPagingData>(pagingApi: IPagingApi<IRelayPagingVariables>, data: TData): IPagingInfo {
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
    };
}
