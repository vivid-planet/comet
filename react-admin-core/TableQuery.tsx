import { CircularProgress, RootRef } from "@material-ui/core";
import { DocumentNode } from "graphql";
import * as React from "react";
import { Query } from "react-apollo";
import ISelectionApi from "./SelectionApi";
import { IPagingStrategy } from "./table/pagingStrategy/PagingStrategy";
import * as sc from "./TableQuery.sc";
import TableQueryContext, { ITableQueryApi } from "./TableQueryContext";

export const parseIdFromIri = (iri: string) => {
    const m = iri.match(/\/(\d+)/);
    if (!m) return null;
    return m[1];
};

export interface IQueryResult<TTableData, TVariables, TData> {
    // extends ObservableQueryFields<TData, TVariables>
    // client: ApolloClient<any>;
    data: TData;
    // error?: ApolloError;
    loading: boolean;
    // networkStatus: NetworkStatus;
    order: "asc" | "desc";
    sort?: string;
    tableQueryApi: ITableQueryApi;
    tableData: TTableData;
}

export interface IDefaultVariables {
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
    pagingStrategy?: IPagingStrategy;
    children: (result: IQueryResult<TTableData, TVariables, TData>) => React.ReactNode;
}
interface IState {
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
            changeFilters: this.changeFilters.bind(this),
            changeSort: this.changeSort.bind(this),
            getVariables: this.getVariables.bind(this),
            getQuery: this.getQuery.bind(this),
            onRowCreated: this.onRowCreated.bind(this),
            onRowDeleted: this.onRowDeleted.bind(this),
        };
        this.state = {
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

                            const data = queryResult.data[this.props.tableDataAccessor];

                            const tableData = {
                                pagingActions: this.props.pagingStrategy ? this.props.pagingStrategy.createPagingActions(this, data) : null,
                                data: this.props.pagingStrategy ? this.props.pagingStrategy.extractRows(data) : data.data,
                                totalCount: data.totalCount,
                            };

                            this.fetchMore = queryResult.fetchMore;
                            const extendedQueryResult = {
                                ...queryResult,
                                tableData,
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

    public changePage(variables: object) {
        if (this.domRef.current) {
            this.domRef.current.scrollIntoView();
        }
        return this.fetchMore({
            variables,
            updateQuery: ({}, { fetchMoreResult }: { fetchMoreResult: any }) => {
                return fetchMoreResult;
            },
        });
    }

    private getVariables() {
        const variables: any = { ...(this.props.variables as any), ...this.state.filters };
        variables.sort = this.state.sort;
        variables.order = this.state.order;
        return variables;
    }

    private getQuery() {
        return this.props.query;
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
