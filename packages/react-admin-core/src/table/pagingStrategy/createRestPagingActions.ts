import * as queryString from "query-string";
import { ITableQueryApi } from "../../TableQueryContext";
import { IPagingActions } from "./PagingStrategy";

function getPageParameterFromUrl(url: string) {
    const params = queryString.parse(queryString.extract(url));
    return params ? params.page : null;
}

interface IRestPagingData {
    nextPage: string;
    previousPage: string;
}
export function createRestPagingActions<TData extends IRestPagingData>(data: TData): IPagingActions {
    const nextPage = data.nextPage ? getPageParameterFromUrl(data.nextPage) : null;
    const previousPage = data.previousPage ? getPageParameterFromUrl(data.previousPage) : null;
    return {
        fetchNextPage: nextPage
            ? (tableQuery: ITableQueryApi) => {
                  tableQuery.changePage({
                      page: nextPage,
                  });
              }
            : undefined,
        fetchPreviousPage: previousPage
            ? (tableQuery: ITableQueryApi) => {
                  tableQuery.changePage({
                      page: previousPage,
                  });
              }
            : undefined,
    };
}
