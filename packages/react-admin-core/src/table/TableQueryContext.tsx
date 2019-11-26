import { DocumentNode } from "graphql";
import * as React from "react";
import { ITableData } from "./useTableQuery";

export interface ITableQueryApi {
    getVariables: () => object;
    getInnerOptions: () => object;
    getQuery: () => DocumentNode;
    getResolveTableData: (data: object) => ITableData<any>;
    onRowCreated: (id: string) => void;
    onRowDeleted: () => void;
}

export interface ITableQueryContext {
    api: ITableQueryApi;
}

export const TableQueryContext = React.createContext<ITableQueryContext | undefined>(undefined);
