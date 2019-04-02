import TableQuery from "../../TableQuery";

export interface IPagingActions {
    fetchNextPage?: () => void;
    fetchPreviousPage?: () => void;
}
export interface IPagingStrategy {
    createPagingActions: (tableQuery: TableQuery, queryData: any) => IPagingActions;
    extractRows: (data: any) => any[];
}
