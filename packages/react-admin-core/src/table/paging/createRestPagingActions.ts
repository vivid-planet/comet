import * as queryString from "query-string";
import { IPagingApi } from "../useTableQueryPaging";
import { IPagingInfo } from "./IPagingInfo";

function getPageParameterFromUrl(url: string) {
    const params = queryString.parse(queryString.extract(url));
    return params && params.page ? parseInt(params.page as string, 10) : null;
}

interface IRestPagingData {
    nextPage?: string;
    previousPage?: string;
    totalPages?: number;
}

export function createRestPagingActions<TData extends IRestPagingData>(pagingApi: IPagingApi<number>, data: TData): IPagingInfo {
    const nextPage = data.nextPage ? getPageParameterFromUrl(data.nextPage) : null;
    const previousPage = data.previousPage ? getPageParameterFromUrl(data.previousPage) : null;
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
    };
}
