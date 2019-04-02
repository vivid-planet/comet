import { DocumentNode } from "graphql";
import * as React from "react";

export interface ITableQueryApi {
    changeFilters: (filters: object) => void;
    changeSort: (columnName: string) => void;
    getVariables: () => object;
    getQuery: () => DocumentNode;
    onRowCreated: (id: string) => void;
    onRowDeleted: () => void;
}

export interface ITableQueryContext {
    api: ITableQueryApi;
    sort?: string;
    order: "asc" | "desc";
}

export default React.createContext<ITableQueryContext | undefined>(undefined);
