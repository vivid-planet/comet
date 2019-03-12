import TableQuery from "../../TableQuery";
import { IPagingActions, IPagingStrategy } from "./PagingStrategy";

class RelayPaging implements IPagingStrategy {
    public createPagingActions(tableQuery: TableQuery, data: any): IPagingActions {
        return {
            fetchNextPage:
                data.pageInfo && data.pageInfo.hasNextPage
                    ? () => {
                          tableQuery.changePage({
                              after: data.pageInfo.endCursor,
                          });
                      }
                    : undefined,
            fetchPreviousPage:
                data.pageInfo && data.pageInfo.hasPreviousPage
                    ? () => {
                          tableQuery.changePage({
                              before: data.pageInfo.startCursor,
                          });
                      }
                    : undefined,
        };
    }
    public extractRows(data: any) {
        if (!data.edges) return null;
        return data.edges.map((i: any) => i.node);
    }
}
export default RelayPaging;
