import { QueryResult } from "@apollo/react-common";
import { QueryHookOptions, useQuery } from "@apollo/react-hooks";
import { DocumentNode } from "graphql";
import * as React from "react";
import { ISelectionApi } from "../SelectionApi";
import { IPagingInfo } from "./paging";
import { ITableQueryApi } from "./TableQueryContext";

interface ITableData<TRow extends { id: string | number } = { id: string | number }> {
    data?: TRow[];
    totalCount?: number;
    pagingInfo?: IPagingInfo;
}
interface ITableQueryHookOptions<TData, TVariables, TTableData extends ITableData> extends QueryHookOptions<TData, TVariables> {
    resolveTableData: (data: TData) => TTableData;
    selectionApi?: ISelectionApi;
}

interface ITableQueryHookResult<TData, TVariables, TTableData extends ITableData> extends QueryResult<TData, TVariables> {
    tableData?: TTableData;
    api: ITableQueryApi;
}

export function useTableQuery<TInnerData, TInnerVariables>() {
    function useTableQueryInner<TTableData extends ITableData>(
        q: DocumentNode,
        options: ITableQueryHookOptions<TInnerData, TInnerVariables, TTableData>,
    ): ITableQueryHookResult<TInnerData, TInnerVariables, TTableData> {
        const { resolveTableData, selectionApi, variables, ...restOptions } = options;

        const api: ITableQueryApi = {
            getVariables,
            getQuery: () => q,
            onRowCreated,
            onRowDeleted,
        };

        const innerOptions = {
            notifyOnNetworkStatusChange: true, // to get loading state correctly during paging
            ...restOptions,
            variables: getVariables(),
        };
        const ret: ITableQueryHookResult<TInnerData, TInnerVariables, TTableData> = {
            ...useQuery<TInnerData, TInnerVariables>(q, innerOptions),
            api,
        };

        React.useEffect(() => {
            ret.refetch();
        }, []);

        function getVariables() {
            const vars: any = { ...(options.variables as any) };
            return vars;
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
        return ret;
    }
    return useTableQueryInner;
}
