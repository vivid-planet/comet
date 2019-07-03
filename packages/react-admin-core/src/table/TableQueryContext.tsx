import { DocumentNode } from "graphql";
import * as React from "react";

export interface ITableQueryApi {
    changeFilters: (filters: object) => void;
    changePage: (variables: object, page?: number) => void;
    getVariables: () => object;
    getQuery: () => DocumentNode;
    onRowCreated: (id: string) => void;
    onRowDeleted: () => void;
    attachTableQueryRef: (ref: React.MutableRefObject<HTMLDivElement | undefined>) => void;
}

export interface ITableQueryContext {
    api: ITableQueryApi;
}

export const TableQueryContext = React.createContext<ITableQueryContext | undefined>(undefined);
