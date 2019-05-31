import { DocumentNode } from "graphql";
import * as React from "react";

export interface ITableQueryApi {
    changeFilters: (filters: object) => void;
    changeSort: (columnName: string) => void;
    changePage: (variables: object) => void;
    getVariables: () => object;
    getQuery: () => DocumentNode;
    onRowCreated: (id: string) => void;
    onRowDeleted: () => void;
    attachTableQueryRef: (ref: React.MutableRefObject<HTMLDivElement | undefined>) => void;
}

export interface ITableQueryContext {
    api: ITableQueryApi;
    // sort?: string;
    // order: "asc" | "desc";
}

export const TableQueryContext = React.createContext<ITableQueryContext | undefined>(undefined);
