import { DocumentNode } from "graphql";
import * as React from "react";

import { ITableData } from "./useTableQuery";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export interface ITableQueryApi {
    getVariables: () => object;
    getInnerOptions: () => object;
    getQuery: () => DocumentNode;
    resolveTableData: (data: object) => ITableData<any>;
    onRowCreated: (id: string) => void;
    onRowDeleted: () => void;
}

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export interface ITableQueryContext {
    api: ITableQueryApi;
}

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export const TableQueryContext = React.createContext<ITableQueryContext | undefined>(undefined);
