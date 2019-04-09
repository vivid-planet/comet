import { CircularProgress, RootRef } from "@material-ui/core";
import { ApolloError } from "apollo-client";
import { DocumentNode } from "graphql";
import * as React from "react";
import { Query, renderToStringWithData } from "react-apollo";
import ISelectionApi from "./SelectionApi";
import { IPagingActions } from "./table/pagingStrategy/PagingStrategy";
import * as sc from "./TableQuery.sc";
import TableQueryContext, { ITableQueryApi } from "./TableQueryContext";

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
}

class TableQuery extends React.Component<IProps> {
    private domRef = React.createRef<HTMLDivElement>();
    constructor(props: IProps) {
        super(props);
    }
    public render() {
        return (
            <RootRef rootRef={this.domRef}>
                <TableQueryContext.Provider
                    value={{
                        api: this.props.api,
                    }}
                >
                    {this.props.loading && (
                        <sc.ProgressOverlayContainer>
                            <CircularProgress />
                        </sc.ProgressOverlayContainer>
                    )}
                    {this.props.error && <p>Error :( {this.props.error.toString()}</p>}
                    {this.props.children}
                </TableQueryContext.Provider>
            </RootRef>
        );
    }
}

export default TableQuery;
