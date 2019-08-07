import { DocumentNode } from "graphql";
import * as React from "react";

export interface ITableQueryApi {
    getVariables: () => object;
    getQuery: () => DocumentNode;
    onRowCreated: (id: string) => void;
    onRowDeleted: () => void;
}

export interface ITableQueryContext {
    api: ITableQueryApi;
}

export const TableQueryContext = React.createContext<ITableQueryContext | undefined>(undefined);
