import { ITableQueryApi } from "../TableQueryContext";

export interface IPagingInfo {
    fetchNextPage?: (tableQuery: ITableQueryApi) => void;
    fetchPreviousPage?: (tableQuery: ITableQueryApi) => void;
    totalPages?: number;
}
