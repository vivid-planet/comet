import { ITableQueryApi } from "../../TableQueryContext";
import { IPagingActions } from "./PagingStrategy";

interface IRelayPagingData {
    pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
    };
}
export function createRelayPagingActions<TData extends IRelayPagingData>(data: TData): IPagingActions {
    return {
        fetchNextPage:
            data.pageInfo && data.pageInfo.hasNextPage
                ? (tableQuery: ITableQueryApi) => {
                      tableQuery.changePage({
                          after: data.pageInfo.endCursor,
                      });
                  }
                : undefined,
        fetchPreviousPage:
            data.pageInfo && data.pageInfo.hasPreviousPage
                ? (tableQuery: ITableQueryApi) => {
                      tableQuery.changePage({
                          before: data.pageInfo.startCursor,
                      });
                  }
                : undefined,
    };
}
