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
    totalPages?: number | null;
}

interface IOptions {
    pageParameterName: string;
    firstLastPage?: boolean;
    specificPage?: boolean;
}

export function createRestPagingActions<TData extends IRestPagingData>(
    pagingApi: IPagingApi<number>,
    data: TData,
    options: IOptions = { pageParameterName: "page", firstLastPage: false, specificPage: false },
): IPagingInfo {
    const nextPage = data.nextPage ? getPageParameterFromUrl(data.nextPage, options) : null;
    const previousPage = data.previousPage ? getPageParameterFromUrl(data.previousPage, options) : null;
    return {
        fetchFirstPage: options.firstLastPage
            ? () => {
                  pagingApi.changePage(1, 1);
              }
            : undefined,
        fetchLastPage:
            data.totalPages && options.firstLastPage
                ? () => {
                      data.totalPages && pagingApi.changePage(data.totalPages, data.totalPages);
                  }
                : undefined,
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
        fetchSpecificPage: options.specificPage
            ? (page: number) => {
                  pagingApi.changePage(page, page);
              }
            : undefined,
        totalPages: data.totalPages,
        currentPage: pagingApi.currentPage,
        attachTableRef: pagingApi.attachTableRef,
    };
}
