import { gql } from "@apollo/client";
import { Typography } from "@mui/material";

import type { LaunchesPastResult } from "../../../.storybook/mocks/handlers";
import { MainContent } from "../../common/MainContent";
import { ToolbarItem } from "../../common/toolbar/item/ToolbarItem";
import { Toolbar } from "../../common/toolbar/Toolbar";
import { Field } from "../../form/Field";
import { FinalFormInput } from "../../form/FinalFormInput";
import { createOffsetLimitPagingAction } from "../paging/createOffsetLimitPagingAction";
import { Table } from "../Table";
import { TableFilterFinalForm } from "../TableFilterFinalForm";
import { TableQuery } from "../TableQuery";
import { useTableQuery } from "../useTableQuery";
import { useTableQueryFilter } from "../useTableQueryFilter";
import { useTableQueryPaging } from "../useTableQueryPaging";
import { SortDirection, useTableQuerySort } from "../useTableQuerySort";

const query = gql`
    query LaunchesPast($limit: Int, $offset: Int, $sort: String, $order: String) {
        launchesPastResult(limit: $limit, offset: $offset, sort: $sort, order: $order) {
            data {
                id
                mission_name
                launch_date_local
            }
            result {
                totalCount
            }
        }
    }
`;

interface IFilterValues {
    query?: string;
}

interface IVariables extends IFilterValues {
    limit: number;
    offset: number;
    sort: string;
    order: string;
}

export default {
    title: "admin/table",
};

export const FilterPagingSort = () => {
    const filterApi = useTableQueryFilter<IFilterValues>({});
    const pagingApi = useTableQueryPaging(0);
    const limit = 10;
    const sortApi = useTableQuerySort({
        columnName: "mission_name",
        direction: SortDirection.ASC,
    });

    const { tableData, api, loading, error } = useTableQuery<{ launchesPastResult: LaunchesPastResult }, IVariables>()(query, {
        variables: {
            ...filterApi.current,
            offset: pagingApi.current,
            limit,
            sort: sortApi.current.columnName,
            order: sortApi.current.direction,
        },
        resolveTableData: (data) => ({
            data: data.launchesPastResult.data,
            totalCount: data.launchesPastResult.result.totalCount,
            pagingInfo: createOffsetLimitPagingAction(pagingApi, { totalCount: data.launchesPastResult.result.totalCount }, limit),
        }),
    });

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
                                    name: "mission_name",
                                    header: "Mission Name",
                                    sortable: true,
                                },
                                {
                                    name: "launch_date_local",
                                    header: "Launch Date",
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
