import { CircularProgress, RootRef } from "@material-ui/core";
import { DocumentNode } from "graphql";
import * as React from "react";
import { Query } from "react-apollo";
import ISelectionApi from "./SelectionApi";
import * as sc from "./TableQuery.sc";
import TableQueryContext, { ITableQueryApi } from "./TableQueryContext";

export interface IQueryResult<TTableData, TVariables, TData> {
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
    tableData: TTableData;
}

export interface IDefaultVariables {
    page?: number;
    order?: "asc" | "desc";
    sort?: string;
}
interface IProps<TTableData, TVariables, TData> {
    query: DocumentNode;
    tableDataAccessor: string;
    variables?: TVariables;
    defaultSort?: string;
    defaultOrder?: "asc" | "desc";
    selectionApi?: ISelectionApi;
    children: (result: IQueryResult<TTableData, TVariables, TData>) => React.ReactNode;
}
interface IState {
    page: number;
    order: "asc" | "desc";
    sort?: string;
    filters: object;
}

class TableQuery<TTableData = any, TVariables extends IDefaultVariables = IDefaultVariables, TData = any> extends React.Component<
    IProps<TTableData, TVariables, TData>,
    IState
> {
    private tableQueryApi: ITableQueryApi;
    private fetchMore: any;
    private domRef = React.createRef<HTMLDivElement>();
    constructor(props: IProps<TTableData, TVariables, TData>) {
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
            page: 1,
            sort: props.defaultSort,
            order: props.defaultOrder || "asc",
            filters: {},
        };
    }
    public render() {
        return (
            <RootRef rootRef={this.domRef}>
                <TableQueryContext.Provider
                    value={{
                        api: this.tableQueryApi,
                        page: this.state.page,
                        sort: this.state.sort,
                        order: this.state.order,
                    }}
                >
                    <Query query={this.props.query} variables={this.getVariables()} notifyOnNetworkStatusChange={true}>
                        {(queryResult: any) => {
                            if (queryResult.error) return <p>Error :( {queryResult.error.toString()}</p>;
                            if (!queryResult.data[this.props.tableDataAccessor]) {
                                return (
                                    <sc.ProgressContainer>
                                        <CircularProgress />
                                    </sc.ProgressContainer>
                                );
                            }

                            this.fetchMore = queryResult.fetchMore;
                            const extendedQueryResult = {
                                ...queryResult,
                                tableData: queryResult.data[this.props.tableDataAccessor],
                                page: this.state.page,
                                changePage: this.changePage.bind(this),
                                order: this.state.order,
                                sort: this.state.sort,
                                tableQueryApi: this.tableQueryApi,
                            };
                            return (
                                <>
                                    {queryResult.loading && (
                                        <sc.ProgressOverlayContainer>
                                            <CircularProgress />
                                        </sc.ProgressOverlayContainer>
                                    )}
                                    {this.props.children(extendedQueryResult)}
                                </>
                            );
                        }}
                    </Query>
                </TableQueryContext.Provider>
            </RootRef>
        );
    }

    private getVariables() {
        const variables: any = { ...(this.props.variables as any), ...this.state.filters };
        variables.sort = this.state.sort;
        variables.order = this.state.order;
        variables.page = 1;
        return variables;
    }

    private getQuery() {
        return this.props.query;
    }

    private changePage(page: number) {
        this.fetchMore({
            variables: {
                page,
            },
            updateQuery: ({}, { fetchMoreResult }: { fetchMoreResult: any }) => {
                this.setState({ page });
                return fetchMoreResult;
            },
        });
        if (this.domRef.current) {
            this.domRef.current.scrollIntoView();
        }
    }

    private changeFilters(filters: object) {
        this.setState({
            filters: { ...filters },
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
                    page: 1,
                    sort: columnName,
                    order,
                });
                return fetchMoreResult;
            },
        });
    }

    private onRowCreated(id: string) {
        if (this.props.selectionApi) {
            this.props.selectionApi.handleSelectId(id);
        }
    }

    private onRowDeleted(id: string) {
        if (this.props.selectionApi) {
            this.props.selectionApi.handleDeselect();
        }
    }
}

export default TableQuery;
