import { CircularProgress, RootRef } from "@material-ui/core";
import { ApolloError } from "apollo-client";
import * as React from "react";
import * as sc from "./TableQuery.sc";
import { ITableQueryApi, TableQueryContext } from "./TableQueryContext";

export const parseIdFromIri = (iri: string) => {
    const m = iri.match(/\/(\d+)/);
    if (!m) return null;
    return m[1];
};

export interface IDefaultVariables {
    order?: "asc" | "desc";
    sort?: string;
}
interface IProps {
    api: ITableQueryApi;
    loading: boolean;
    error?: ApolloError;
    children: React.ReactNode;
}

export function TableQuery(props: IProps) {
    const domRef = React.createRef<HTMLDivElement>();
    return (
        <RootRef rootRef={domRef}>
            <TableQueryContext.Provider
                value={{
                    api: props.api,
                }}
            >
                {props.loading && (
                    <sc.ProgressOverlayContainer>
                        <CircularProgress />
                    </sc.ProgressOverlayContainer>
                )}
                {props.error && <p>Error :( {props.error.toString()}</p>}
                {props.children}
            </TableQueryContext.Provider>
        </RootRef>
    );
}
