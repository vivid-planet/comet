import { gql } from "@apollo/client";
import { Typography } from "@mui/material";

import { MainContent } from "../../common/MainContent";
import { ToolbarItem } from "../../common/toolbar/item/ToolbarItem";
import { Toolbar } from "../../common/toolbar/Toolbar";
import { Field } from "../../form/Field";
import { FinalFormInput } from "../../form/FinalFormInput";
import { createPagePagingActions } from "../paging/createPagePagingActions";
import { Table } from "../Table";
import { TableFilterFinalForm } from "../TableFilterFinalForm";
import { TableQuery } from "../TableQuery";
import { useTableQuery } from "../useTableQuery";
import { useTableQueryFilter } from "../useTableQueryFilter";
import { useTableQueryPaging } from "../useTableQueryPaging";
import { SortDirection, useTableQuerySort } from "../useTableQuerySort";

interface IUser {
    id: number;
    name: string;
    username: string;
    email: string;
}

interface IFilterValues {
    query?: string;
}

export default {
    title: "@comet/admin/table",
};

export const FilterPagingSort = () => {
    const filterApi = useTableQueryFilter<IFilterValues>({});
    const pagingApi = useTableQueryPaging(1);
    const sortApi = useTableQuerySort({ columnName: "name", direction: SortDirection.ASC });

    const { tableData, api, loading, error } = useTableQuery<
        {
            usersWithPaging: {
                nodes: IUser[];
                totalCount: number;
                nextPage?: number;
                previousPage?: number;
                totalPages?: number;
            };
        },
        { query?: string; sort?: string; order?: string; page: number; size: number }
    >()(
        gql`
            query UsersWithPaging($query: String, $sort: String, $order: String, $page: Int, $size: Int) {
                usersWithPaging(query: $query, sort: $sort, order: $order, page: $page, size: $size) {
                    nodes {
                        id
                        name
                        username
                        email
                    }
                    totalCount
                    nextPage
                    previousPage
                    totalPages
                }
            }
        `,
        {
            variables: {
                ...filterApi.current,
                sort: sortApi.current.columnName,
                order: sortApi.current.direction,
                page: pagingApi.current,
                size: 5,
            },
            resolveTableData: (data) => ({
                data: data.usersWithPaging.nodes,
                totalCount: data.usersWithPaging.totalCount,
                pagingInfo: createPagePagingActions(pagingApi, {
                    totalPages: data.usersWithPaging.totalPages ?? 0,
                    nextPage: data.usersWithPaging.nextPage ?? null,
                    previousPage: data.usersWithPaging.previousPage ?? null,
                }),
            }),
        },
    );

    return (
        <TableQuery api={api} loading={loading} error={error}>
            <>
                <Toolbar>
                    <ToolbarItem>
                        <Typography variant="h3">Filter Paging Sort</Typography>
                    </ToolbarItem>
                    <ToolbarItem>
                        <TableFilterFinalForm<IFilterValues> filterApi={filterApi}>
                            <Field name="query" type="text" component={FinalFormInput} fullWidth />
                        </TableFilterFinalForm>
                    </ToolbarItem>
                </Toolbar>
                {tableData && (
                    <MainContent>
                        <Table
                            sortApi={sortApi}
                            {...tableData}
                            columns={[
                                {
                                    name: "name",
                                    header: "Name",
                                    sortable: true,
                                },
                                {
                                    name: "username",
                                    header: "Username",
                                    sortable: true,
                                },
                                {
                                    name: "email",
                                    header: "E-Mail",
                                    sortable: true,
                                },
                            ]}
                        />
                    </MainContent>
                )}
            </>
        </TableQuery>
    );
};
