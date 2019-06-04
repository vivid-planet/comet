import * as queryString from "query-string";
import { ITableQueryApi } from "../TableQueryContext";
import { IPagingInfo } from "./PagingStrategy";

function getPageParameterFromUrl(url: string) {
    const params = queryString.parse(queryString.extract(url));
    return params && params.page ? parseInt(params.page as string, 10) : null;
}

interface IRestPagingData {
    nextPage: string;
    previousPage: string;
    totalPages?: number;
}

export function createRestPagingActions<TData extends IRestPagingData>(data: TData): IPagingInfo {
    const nextPage = data.nextPage ? getPageParameterFromUrl(data.nextPage) : null;
    const previousPage = data.previousPage ? getPageParameterFromUrl(data.previousPage) : null;
    return {
        fetchNextPage: nextPage
            ? (tableQuery: ITableQueryApi) => {
                  tableQuery.changePage(
                      {
                          page: nextPage,
                      },
                      nextPage,
                  );
              }
            : undefined,
        fetchPreviousPage: previousPage
            ? (tableQuery: ITableQueryApi) => {
                  tableQuery.changePage(
                      {
                          page: previousPage,
                      },
                      previousPage,
                  );
              }
            : undefined,
        totalPages: data.totalPages,
    };
}
