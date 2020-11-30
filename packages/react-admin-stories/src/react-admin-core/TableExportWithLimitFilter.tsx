import { storiesOf } from "@storybook/react";
import {
    createRestStartLimitPagingActions,
    ExcelExportButton,
    Field,
    FieldContainerLabelAbove,
    FinalFormInput,
    Table,
    TableFilterFinalForm,
    TableQuery,
    useExportDisplayedTableData,
    useExportTableQuery,
    useTableQuery,
    useTableQueryFilter,
    useTableQueryPaging,
    VisibleType,
} from "@vivid-planet/react-admin";
import gql from "graphql-tag";
import * as React from "react";

import { apolloStoryDecorator } from "../apollo-story.decorator";

const gqlRest = gql;

const query = gqlRest`
query users(
    $query: String
    $start : Int
    $limit : Int
) {
    photos(
        query: $query
        start: $start
        limit: $limit
    ) @rest(type: "Photos", path: "photos?q={args.query}&_start={args.start}&_limit={args.limit}") {
        id
        albumId
        title
        thumbnailUrl
    }
}
`;
interface IPhoto {
    id: number;
    albumId: number;
    title: string;
    thumbnailUrl: string;
}

interface IQueryData {
    photos: IPhoto[];
}

interface IFilterValues {
    query: string;
}
interface IVariables extends IFilterValues {
    start: number;
    limit: number;
}

function Story() {
    const totalCount = 5000;
    const loadLimit = 50;
    const pagingApi = useTableQueryPaging(0);

    const filterApi = useTableQueryFilter<IFilterValues>({ query: "" });

    const { tableData, api, loading, error } = useTableQuery<IQueryData, IVariables>()(query, {
        variables: {
            start: pagingApi.current,
            ...filterApi.current,
            limit: loadLimit,
        },
        resolveTableData: (data) => ({
            data: data.photos,
            totalCount,
            pagingInfo: createRestStartLimitPagingActions(pagingApi, {
                totalPages: Math.ceil(totalCount / loadLimit), // Don't calculate this in a real application
                loadLimit,
            }),
        }),
    });

    const exportCurrentPageApi = useExportDisplayedTableData();
    const exportApi = useExportTableQuery<IVariables>(api, { ...filterApi.current, start: 0, limit: 5000 });

    return (
        <TableQuery api={api} loading={loading} error={error}>
            {tableData && (
                <>
                    <TableFilterFinalForm filterApi={filterApi}>
                        <Field
                            name="query"
                            type="text"
                            label="Query"
                            component={FinalFormInput}
                            fullWidth
                            fieldContainerComponent={FieldContainerLabelAbove}
                        />
                    </TableFilterFinalForm>
                    <ExcelExportButton exportApi={exportCurrentPageApi}>Aktuelle Seite exportieren</ExcelExportButton>
                    <ExcelExportButton exportApi={exportApi}>Export All (max. 5000 Rows)</ExcelExportButton>

                    <Table
                        exportApis={[exportCurrentPageApi, exportApi]}
                        {...tableData}
                        columns={[
                            {
                                name: "thumbnailUrl",
                                header: "Thumbnail",
                                sortable: true,
                                visible: { [VisibleType.Browser]: false, [VisibleType.Export]: false },
                                render: (row: IPhoto) => {
                                    return <img src={row.thumbnailUrl} />;
                                },
                                headerExcel: "Thumbnail Url",
                                renderExcel: (row: IPhoto) => {
                                    return row.thumbnailUrl;
                                },
                            },
                            {
                                name: "title",
                                visible: { [VisibleType.Browser]: true },
                                header: "Title",
                                sortable: true,
                            },
                        ]}
                    />
                </>
            )}
        </TableQuery>
    );
}

storiesOf("react-admin", module)
    .addDecorator(apolloStoryDecorator())
    .add("Table Export With Limit Filter", () => <Story />);
