import * as queryString from "query-string";
import { IPagingApi } from "../useTableQueryPaging";
import { IPagingInfo } from "./IPagingInfo";

function getPageParameterFromUrl(url: string, options: IOptions) {
    const params = queryString.parse(queryString.extract(url));
    return params && params[options.pageParameterName] ? parseInt(params[options.pageParameterName] as string, 10) : null;
}

interface IRestPagingData {
    nextPage?: string;
    previousPage?: string;
    totalPages?: number;
}

interface IOptions {
    pageParameterName: string;
}

export function createRestPagingActions<TData extends IRestPagingData>(
    pagingApi: IPagingApi<number>,
    data: TData,
    options: IOptions = { pageParameterName: "page" },
): IPagingInfo {
    const nextPage = data.nextPage ? getPageParameterFromUrl(data.nextPage, options) : null;
    const previousPage = data.previousPage ? getPageParameterFromUrl(data.previousPage, options) : null;
    return {
        fetchNextPage: nextPage
            ? () => {
                  pagingApi.changePage(nextPage, nextPage);
              }
            : undefined,
        fetchPreviousPage: previousPage
            ? () => {
                  pagingApi.changePage(previousPage, previousPage);
              }
            : undefined,
        totalPages: data.totalPages,
        currentPage: pagingApi.currentPage,
    };
}
