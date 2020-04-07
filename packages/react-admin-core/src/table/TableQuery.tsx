import { CircularProgress } from "@material-ui/core";
import { ApolloError } from "apollo-client";
import * as React from "react";
import * as sc from "./TableQuery.sc";
import { ITableQueryApi, TableQueryContext } from "./TableQueryContext";

export const parseIdFromIri = (iri: string) => {
    const m = iri.match(/\/(\d+)/);
    if (!m) return null;
    return m[1];
};

export interface IDefaultVariables {}
interface IProps {
    api: ITableQueryApi;
    loading: boolean;
    error?: ApolloError;
    children: React.ReactNode;
}

export function TableQuery(props: IProps) {
    return (
        <TableQueryContext.Provider
            value={{
                api: props.api,
            }}
        >
            <sc.ProgressOverlayContainer>
                {props.loading && (
                    <sc.TableCircularProgressContainer>
                        <CircularProgress />
                    </sc.TableCircularProgressContainer>
                )}
                {props.error && <p>Error :( {props.error.toString()}</p>}
                {props.children}
            </sc.ProgressOverlayContainer>
        </TableQueryContext.Provider>
    );
}
