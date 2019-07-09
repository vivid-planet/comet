import { OperationVariables } from "apollo-client";
import { DocumentNode } from "graphql";
import * as React from "react";
import { QueryHookOptions, QueryHookResult, useQuery } from "react-apollo-hooks";
import { ISelectionApi } from "../SelectionApi";
import { IPagingInfo } from "./pagingStrategy";
import { ITableQueryApi } from "./TableQueryContext";

interface ITableData<TRow extends { id: string | number } = { id: string | number }> {
    data?: TRow[];
    totalCount?: number;
    currentPage?: number;
    pagingInfo?: IPagingInfo;
}
interface ITableQueryHookOptions<TData, TVariables, TTableData extends ITableData, TCache = object> extends QueryHookOptions<TVariables, TCache> {
    resolveTableData: (data: TData) => TTableData;
    selectionApi?: ISelectionApi;
}

interface ITableQueryHookResult<TData, TVariables, TTableData extends ITableData> extends QueryHookResult<TData, TVariables> {
    tableData?: TTableData;
    api: ITableQueryApi;
}

// works around https://github.com/trojanowski/react-apollo-hooks/issues/117
function useQueryKeepDataDuringLoad<TData = any, TVariables = OperationVariables, TCache = object>(
    q: DocumentNode,
    options?: QueryHookOptions<TVariables, TCache>,
): QueryHookResult<TData, TVariables> {
    const [notNullData, setNotNullData] = React.useState<TData>();
    const ret = useQuery(q, options);

    React.useEffect(() => {
        if (ret.data && !ret.loading) {
            setNotNullData(ret.data);
        }
    }, [ret.data]);

    return { ...ret, data: notNullData };
}

export function useTableQuery<TInnerData, TInnerVariables>() {
    function useTableQueryInner<TTableData extends ITableData>(
        q: DocumentNode,
        options: ITableQueryHookOptions<TInnerData, TInnerVariables, TTableData>,
    ): ITableQueryHookResult<TInnerData, TInnerVariables, TTableData> {
        const { resolveTableData, selectionApi, variables, ...restOptions } = options;

        const [filters, setFilters] = React.useState<object>({});
        const [currentPage, setCurrentPage] = React.useState<number | undefined>(1);

        // TODO:
        // order: "asc" | "desc";
        // sort?: string;

        const api: ITableQueryApi = {
            changeFilters,
            changePage,
            getVariables,
            getQuery: () => q,
            onRowCreated,
            onRowDeleted,
            attachTableQueryRef,
        };

        const innerOptions = {
            notifyOnNetworkStatusChange: true, // to get loading state correctly during paging
            ...restOptions,
            variables: getVariables(),
        };
        const ret: ITableQueryHookResult<TInnerData, TInnerVariables, TTableData> = {
            ...useQueryKeepDataDuringLoad<TInnerData, TInnerVariables>(q, innerOptions),
            api,
        };

        React.useEffect(() => {
            ret.refetch();
        }, []);

        let tableQueryRef: React.MutableRefObject<HTMLDivElement | undefined> | undefined;
        function attachTableQueryRef(ref: any) {
            tableQueryRef = ref;
        }
        function changePage(vars: object, page?: number) {
            if (tableQueryRef && tableQueryRef.current) {
                tableQueryRef.current.scrollIntoView();
            }
            return ret
                .fetchMore({
                    variables: vars,
                    updateQuery: ({}, { fetchMoreResult }: { fetchMoreResult: any }) => {
                        return fetchMoreResult;
                    },
                })
                .then(data => {
                    setCurrentPage(page);
                    return data;
                });
        }

        function getVariables() {
            const vars: any = { ...(options.variables as any), ...filters };
            return vars;
        }

        function changeFilters(f: object) {
            setFilters(f);
        }

        function onRowCreated(id: string) {
            if (selectionApi) {
                selectionApi.handleSelectId(id);
            }
        }

        function onRowDeleted() {
            if (selectionApi) {
                selectionApi.handleDeselect();
            }
        }

        if (!ret.data || Object.keys(ret.data).length === 0) {
            return ret;
        }

        ret.tableData = resolveTableData(ret.data);
        ret.tableData.currentPage = currentPage;
        return ret;
    }
    return useTableQueryInner;
}
