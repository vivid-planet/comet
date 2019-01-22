import { CircularProgress } from "@material-ui/core";
import { DocumentNode } from "graphql";
import * as React from "react";
import { OperationVariables, Query } from "react-apollo";
import styled from "styled-components";
import ISelectionApi from "./SelectionApi";
import TableQueryContext, { ITableQueryApi } from "./TableQueryContext";

export interface IQueryResult<TData, TVariables> {
    // extends ObservableQueryFields<TData, TVariables>
    // client: ApolloClient<any>;
    data: TData;
    // error?: ApolloError;
    loading: boolean;
    // networkStatus: NetworkStatus;
    page: number;
    order: "asc" | "desc";
    sort?: string;
    tableQueryApi: ITableQueryApi;
}

export interface IDefaultVariables {
    page?: number;
    order?: "asc" | "desc";
    sort?: string;
}
interface IProps<TData, TVariables> {
    query: DocumentNode;
    variables?: TVariables;
    defaultSort?: string;
    defaultOrder?: "asc" | "desc";
    rowsPerPage?: number;
    selectionApi?: ISelectionApi;
    children: (result: IQueryResult<TData, TVariables>) => React.ReactNode;
}
interface IState {
    page: number;
    order: "asc" | "desc";
    sort?: string;
}

const ProgressContainer = styled.div`
    padding-top: 30px;
    display: flex;
    justify-content: center;
`;

class TableQuery<TData = any, TVariables extends IDefaultVariables = IDefaultVariables> extends React.Component<IProps<TData, TVariables>, IState> {
    private tableQueryApi: ITableQueryApi;
    private fetchMore: any;
    constructor(props: IProps<TData, TVariables>) {
        super(props);
        this.tableQueryApi = {
            changePage: this.changePage.bind(this),
            changeFilters: this.changeFilters.bind(this),
            changeSort: this.changeSort.bind(this),
            getVariables: this.getVariables.bind(this),
            getQuery: this.getQuery.bind(this),
            onRowCreated: this.onRowCreated.bind(this),
            onRowDeleted: this.onRowDeleted.bind(this),
        };
        this.state = {
            page: 0,
            sort: props.defaultSort,
            order: props.defaultOrder || "asc",
        };
    }
    public render() {
        return (
            <TableQueryContext.Provider
                value={{
                    api: this.tableQueryApi,
                    rowsPerPage: this.props.rowsPerPage,
                    page: this.state.page,
                    sort: this.state.sort,
                    order: this.state.order,
                }}
            >
                <Query query={this.props.query} variables={this.getVariables()}>
                    {queryResult => {
                        if (queryResult.loading) {
                            return (
                                <ProgressContainer>
                                    <CircularProgress />
                                </ProgressContainer>
                            );
                        }
                        if (queryResult.error) return <p>Error :( {queryResult.error.toString()}</p>;

                        this.fetchMore = queryResult.fetchMore;
                        const extendedQueryResult = {
                            ...queryResult,
                            page: this.state.page,
                            changePage: this.changePage.bind(this),
                            order: this.state.order,
                            sort: this.state.sort,
                            tableQueryApi: this.tableQueryApi,
                        };
                        return this.props.children(extendedQueryResult);
                    }}
                </Query>
            </TableQueryContext.Provider>
        );
    }

    private getVariables() {
        const variables: any = { ...(this.props.variables as any) };
        variables.sort = this.state.sort;
        variables.order = this.state.order;
        if (this.props.rowsPerPage) {
            variables.offset = 0;
            variables.limit = this.props.rowsPerPage;
        }
        return variables;
    }

    private getQuery() {
        return this.props.query;
    }

    private changePage(page: number) {
        if (!this.props.rowsPerPage) return;
        this.fetchMore({
            variables: {
                offset: page * this.props.rowsPerPage,
            },
            updateQuery: ({}, { fetchMoreResult }: { fetchMoreResult: any }) => {
                this.setState({ page });
                return fetchMoreResult;
            },
        });
    }

    private changeFilters(filters: object) {
        const variables = {
            // offset: 0,
            ...filters,
        };
        this.fetchMore({
            variables,
            updateQuery: ({}, { fetchMoreResult }: { fetchMoreResult: any }) => {
                this.setState({ page: 0 });
                return fetchMoreResult;
            },
        });
    }

    private changeSort(columnName: string) {
        let order: "asc" | "desc" = "asc";
        if (this.state.sort === columnName) {
            order = this.state.order === "asc" ? "desc" : "asc";
        }
        this.fetchMore({
            variables: {
                sort: columnName,
                order,
            },
            updateQuery: ({}, { fetchMoreResult }: { fetchMoreResult: any }) => {
                this.setState({
                    page: 0,
                    sort: columnName,
                    order,
                });
                return fetchMoreResult;
            },
        });
    }

    private onRowCreated(id: string) {
        if (this.props.selectionApi) {
            this.props.selectionApi.selectIdWithoutDirtyCheck(id);
        }
    }

    private onRowDeleted(id: string) {
        if (this.props.selectionApi) {
            this.props.selectionApi.deselectWithoutDirtyCheck();
        }
    }
}

export default TableQuery;
