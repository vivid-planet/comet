import { useApolloClient, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    GridFilterButton,
    MainContent,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    Toolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { BlockPreviewContent } from "@comet/blocks-admin";
import { DamImageBlock } from "@comet/cms-admin";
import { Button, IconButton } from "@mui/material";
import { DataGridPro, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
    GQLBooksGridQuery,
    GQLBooksGridQueryVariables,
    GQLBooksListFragment,
    GQLCreateBookMutation,
    GQLCreateBookMutationVariables,
    GQLDeleteBookMutation,
    GQLDeleteBookMutationVariables,
} from "./BooksGrid.generated";

const booksFragment = gql`
    fragment BooksList on Book {
        id
        updatedAt
        title
        description
        isAvailable
        releaseDate
        price
        publisher
        coverImage
        link
        createdAt
    }
`;

const booksQuery = gql`
    query BooksGrid($offset: Int, $limit: Int, $sort: [BookSort!], $search: String, $filter: BookFilter) {
        books(offset: $offset, limit: $limit, sort: $sort, search: $search, filter: $filter) {
            nodes {
                ...BooksList
            }
            totalCount
        }
    }
    ${booksFragment}
`;

const deleteBookMutation = gql`
    mutation DeleteBook($id: ID!) {
        deleteBook(id: $id)
    }
`;

const createBookMutation = gql`
    mutation CreateBook($input: BookInput!) {
        createBook(input: $input) {
            id
        }
    }
`;

function BooksGridToolbar() {
    return (
        <Toolbar>
            <ToolbarAutomaticTitleItem />
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarActions>
                <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
                    <FormattedMessage id="book.newBook" defaultMessage="New Book" />
                </Button>
            </ToolbarActions>
        </Toolbar>
    );
}

export function BooksGrid(): React.ReactElement {
    const client = useApolloClient();
    const intl = useIntl();
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("BooksGrid") };

    const columns: GridColDef<GQLBooksListFragment>[] = [
        {
            field: "updatedAt",
            headerName: intl.formatMessage({ id: "book.updatedAt", defaultMessage: "Updated At" }),
            type: "dateTime",
            valueGetter: ({ value }) => value && new Date(value),
            width: 150,
        },
        { field: "title", headerName: intl.formatMessage({ id: "book.title", defaultMessage: "Title" }), width: 150 },
        { field: "description", headerName: intl.formatMessage({ id: "book.description", defaultMessage: "Description" }), width: 150 },
        {
            field: "isAvailable",
            headerName: intl.formatMessage({ id: "book.isAvailable", defaultMessage: "Is Available" }),
            type: "boolean",
            width: 150,
        },
        {
            field: "releaseDate",
            headerName: intl.formatMessage({ id: "book.releaseDate", defaultMessage: "Release Date" }),
            type: "dateTime",
            valueGetter: ({ value }) => value && new Date(value),
            width: 150,
        },
        { field: "price", headerName: intl.formatMessage({ id: "book.price", defaultMessage: "Price" }), type: "number", width: 150 },
        {
            field: "publisher",
            headerName: intl.formatMessage({ id: "book.publisher", defaultMessage: "Publisher" }),
            type: "singleSelect",
            valueOptions: [
                { value: "Piper", label: intl.formatMessage({ id: "book.publisher.piper", defaultMessage: "Piper" }) },
                { value: "Ullstein", label: intl.formatMessage({ id: "book.publisher.ullstein", defaultMessage: "Ullstein" }) },
                { value: "Manhattan", label: intl.formatMessage({ id: "book.publisher.manhattan", defaultMessage: "Manhattan" }) },
            ],
            width: 150,
        },
        {
            field: "coverImage",
            headerName: intl.formatMessage({ id: "book.coverImage", defaultMessage: "Cover Image" }),
            filterable: false,
            sortable: false,
            width: 150,
            renderCell: (params) => {
                return <BlockPreviewContent block={DamImageBlock} input={params.row.coverImage} />;
            },
        },
        {
            field: "link",
            headerName: intl.formatMessage({ id: "book.link", defaultMessage: "Link" }),
            filterable: false,
            sortable: false,
            width: 150,
            renderCell: (params) => {
                return <BlockPreviewContent block={LinkBlock} input={params.row.link} />;
            },
        },
        {
            field: "createdAt",
            headerName: intl.formatMessage({ id: "book.createdAt", defaultMessage: "Created At" }),
            type: "dateTime",
            valueGetter: ({ value }) => value && new Date(value),
            width: 150,
        },
        {
            field: "actions",
            headerName: "",
            sortable: false,
            filterable: false,
            type: "actions",
            renderCell: (params) => {
                return (
                    <>
                        <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                            <Edit color="primary" />
                        </IconButton>
                        <CrudContextMenu
                            copyData={() => {
                                const row = params.row;
                                return {
                                    title: row.title,
                                    description: row.description,
                                    isAvailable: row.isAvailable,
                                    releaseDate: row.releaseDate,
                                    price: row.price,
                                    publisher: row.publisher,
                                    coverImage: DamImageBlock.state2Output(DamImageBlock.input2State(row.coverImage)),
                                    link: LinkBlock.state2Output(LinkBlock.input2State(row.link)),
                                };
                            }}
                            onPaste={async ({ input }) => {
                                await client.mutate<GQLCreateBookMutation, GQLCreateBookMutationVariables>({
                                    mutation: createBookMutation,
                                    variables: { input },
                                });
                            }}
                            onDelete={async () => {
                                await client.mutate<GQLDeleteBookMutation, GQLDeleteBookMutationVariables>({
                                    mutation: deleteBookMutation,
                                    variables: { id: params.row.id },
                                });
                            }}
                            refetchQueries={[booksQuery]}
                        />
                    </>
                );
            },
        },
    ];

    const { filter: gqlFilter, search: gqlSearch } = muiGridFilterToGql(columns, dataGridProps.filterModel);

    const { data, loading, error } = useQuery<GQLBooksGridQuery, GQLBooksGridQueryVariables>(booksQuery, {
        variables: {
            filter: gqlFilter,
            search: gqlSearch,
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(dataGridProps.sortModel),
        },
    });
    const rowCount = useBufferedRowCount(data?.books.totalCount);
    if (error) throw error;
    const rows = data?.books.nodes ?? [];

    return (
        <MainContent fullHeight disablePadding>
            <DataGridPro
                {...dataGridProps}
                disableSelectionOnClick
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                components={{
                    Toolbar: BooksGridToolbar,
                }}
            />
        </MainContent>
    );
}
