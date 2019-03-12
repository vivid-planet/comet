import * as queryString from "query-string";
import TableQuery from "../../TableQuery";
import { IPagingActions, IPagingStrategy } from "./PagingStrategy";

class RestPaging implements IPagingStrategy {
    public createPagingActions(tableQuery: TableQuery, data: any): IPagingActions {
        const nextPage = data.nextPage ? this.getPageParameterFromUrl(data.nextPage) : null;
        const previousPage = data.previousPage ? this.getPageParameterFromUrl(data.previousPage) : null;
        return {
            fetchNextPage: nextPage
                ? () => {
                      tableQuery.changePage({
                          page: nextPage,
                      });
                  }
                : undefined,
            fetchPreviousPage: previousPage
                ? () => {
                      tableQuery.changePage({
                          page: previousPage,
                      });
                  }
                : undefined,
        };
    }
    public extractRows(data: any) {
        return data.data;
    }

    private getPageParameterFromUrl(url: string) {
        const params = queryString.parse(queryString.extract(url));
        return params ? params.page : null;
    }
}

export default RestPaging;
