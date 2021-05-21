import { QueryHookOptions, QueryResult, useQuery } from "@apollo/client";
import { DocumentNode } from "graphql";
import * as React from "react";

import { LocalErrorScopeApolloContext } from "../error";
import { ISelectionApi } from "../SelectionApi";
import { IPagingInfo } from "./paging";
import { ITableQueryApi } from "./TableQueryContext";

export interface ITableData<TRow extends { id: string | number } = { id: string | number }> {
    data?: TRow[];
    totalCount?: number;
    pagingInfo?: IPagingInfo;
}
interface ITableQueryHookOptions<TData, TVariables, TTableData extends ITableData> extends QueryHookOptions<TData, TVariables> {
    resolveTableData: (data: TData) => TTableData;
    selectionApi?: ISelectionApi;
    globalErrorHandling?: boolean;
}

export interface ITableQueryHookResult<TData, TVariables, TTableData extends ITableData> extends QueryResult<TData, TVariables> {
    tableData?: TTableData;
    api: ITableQueryApi;
}

export function useTableQuery<TInnerData, TInnerVariables>() {
    function useTableQueryInner<TTableData extends ITableData>(
        q: DocumentNode,
        options: ITableQueryHookOptions<TInnerData, TInnerVariables, TTableData>,
    ): ITableQueryHookResult<TInnerData, TInnerVariables, TTableData> {
        const { selectionApi, variables, globalErrorHandling = false, ...restOptions } = options;

        const api: ITableQueryApi = {
            getVariables,
            getInnerOptions,
            resolveTableData,
            getQuery: () => q,
            onRowCreated,
            onRowDeleted,
        };

        const innerOptions: QueryHookOptions<TInnerData, TInnerVariables> = {
            notifyOnNetworkStatusChange: true, // to get loading state correctly during paging
            ...restOptions,
            variables: getVariables(),
            context: globalErrorHandling ? undefined : LocalErrorScopeApolloContext,
        };
        const ret: ITableQueryHookResult<TInnerData, TInnerVariables, TTableData> = {
            ...useQuery<TInnerData, TInnerVariables>(q, innerOptions),
            api,
        };

        const { refetch } = ret;
        React.useEffect(() => {
            refetch();
        }, [refetch]);

        function getVariables() {
            const vars: any = { ...(options.variables as any) };
            return vars;
        }

        function getInnerOptions() {
            return innerOptions;
        }

        function resolveTableData(data: any) {
            return options.resolveTableData(data);
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

        ret.tableData = options.resolveTableData(ret.data);
        return ret;
    }
    return useTableQueryInner;
}
