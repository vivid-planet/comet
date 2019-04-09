import { ITableQueryApi } from "../../TableQueryContext";

export interface IPagingActions {
    fetchNextPage?: (tableQuery: ITableQueryApi) => void;
    fetchPreviousPage?: (tableQuery: ITableQueryApi) => void;
}
