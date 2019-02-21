import { DocumentNode } from "graphql";
import * as React from "react";

export interface ITableQueryApi {
    changePage: (page: number) => void;
    changeFilters: (filters: object) => void;
    changeSort: (columnName: string) => void;
    getVariables: () => object;
    getQuery: () => DocumentNode;
    onRowCreated: (id: string) => void;
    onRowDeleted: (id: string) => void;
}

export interface ITableQueryContext {
    api: ITableQueryApi;
    page: number;
    sort?: string;
    order: "asc" | "desc";
}

export default React.createContext<ITableQueryContext | undefined>(undefined);
