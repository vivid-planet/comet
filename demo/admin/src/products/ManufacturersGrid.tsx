import { useApolloClient, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    DataGridToolbar,
    filterByFragment,
    GridColDef,
    GridFilterButton,
    MainContent,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    ToolbarFillSpace,
    ToolbarItem,
    Tooltip,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit, Info } from "@comet/admin-icons";
import { Button, IconButton, Typography } from "@mui/material";
import { DataGridPro, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import {
    GQLCreateManufacturerMutation,
    GQLCreateManufacturerMutationVariables,
    GQLDeleteManufacturerMutation,
    GQLDeleteManufacturerMutationVariables,
    GQLManufacturersListQuery,
    GQLManufacturersListQueryVariables,
} from "@src/products/ManufacturersGrid.generated";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

function ManufacturersGridToolbar() {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarItem>
                <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
                    <FormattedMessage id="manufacturers.newManufacturer" defaultMessage="New Manufacturer" />
                </Button>
            </ToolbarItem>
        </DataGridToolbar>
    );
}

type GridValues = GQLManufacturersListQuery["manufacturers"]["nodes"][0];

export function ManufacturersGrid() {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ManufacturersGrid") };
    const sortModel = dataGridProps.sortModel;
    const client = useApolloClient();
    const intl = useIntl();

    const columns: GridColDef<GridValues>[] = [
        {
            field: "id",
            width: 150,
            renderHeader: () => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography fontWeight={400} fontSize={14}>
                        {intl.formatMessage({ id: "manufacturers.id", defaultMessage: "ID" })}
                    </Typography>
                    <Tooltip
                        trigger="click"
                        title={<FormattedMessage id="comet.manufacturers.id.info" defaultMessage="The id of the manufacturer" />}
                    >
                        <IconButton>
                            <Info />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
        {
            field: "name",
            headerName: intl.formatMessage({ id: "manufacturers.name", defaultMessage: "Name" }),
        },
        {
            field: "address.street",
            headerName: intl.formatMessage({ id: "manufacturers.street", defaultMessage: "Street" }),
            valueGetter: ({ row }) => `${row.address?.street} ${row.address?.streetNumber}`,
        },
        {
            field: "address.zip",
            headerName: intl.formatMessage({ id: "manufacturers.zip", defaultMessage: "ZIP" }),
            valueGetter: ({ row }) => row.address?.zip,
        },
        {
            field: "address.alternativeAddress.street",
            headerName: intl.formatMessage({ id: "manufacturers.alternativeAddressStreet", defaultMessage: "alt. Street" }),
            valueGetter: ({ row }) => `${row.address?.alternativeAddress?.street} ${row.address?.alternativeAddress?.streetNumber}`,
        },
        {
            field: "address.alternativeAddress.zip",
            headerName: intl.formatMessage({ id: "manufacturers.alternativeAddressZip", defaultMessage: "alt. ZIP" }),
            valueGetter: ({ row }) => row.address?.alternativeAddress?.zip,
        },
        {
            field: "addressAsEmbeddable.street",
            headerName: intl.formatMessage({ id: "manufacturers.street2", defaultMessage: "Street2" }),
            valueGetter: ({ row }) => `${row.addressAsEmbeddable?.street} ${row.addressAsEmbeddable?.streetNumber}`,
        },
        {
            field: "addressAsEmbeddable.zip",
            headerName: intl.formatMessage({ id: "manufacturers.zip2", defaultMessage: "ZIP2" }),
            valueGetter: ({ row }) => row.addressAsEmbeddable?.zip,
        },
        {
            field: "addressAsEmbeddable.alternativeAddress.street",
            headerName: intl.formatMessage({ id: "manufacturers.alternativeAddressStreet2", defaultMessage: "alt. Street2" }),
            valueGetter: ({ row }) =>
                `${row.addressAsEmbeddable?.alternativeAddress?.street} ${row.addressAsEmbeddable?.alternativeAddress?.streetNumber}`,
        },
        {
            field: "addressAsEmbeddable.alternativeAddress.zip",
            headerName: intl.formatMessage({ id: "manufacturers.alternativeAddressZip", defaultMessage: "alt. ZIP2" }),
            valueGetter: ({ row }) => row.addressAsEmbeddable?.alternativeAddress?.zip,
        },
        {
            field: "action",
            headerName: "",
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                            <Edit color="primary" />
                        </IconButton>
                        <CrudContextMenu
                            onPaste={async ({ input }) => {
                                await client.mutate<GQLCreateManufacturerMutation, GQLCreateManufacturerMutationVariables>({
                                    mutation: createManufacturerMutation,
                                    variables: {
                                        input: {
                                            name: input.name,
                                            address: input.address,
                                            addressAsEmbeddable: input.addressAsEmbeddable,
                                        },
                                    },
                                });
                            }}
                            onDelete={async () => {
                                await client.mutate<GQLDeleteManufacturerMutation, GQLDeleteManufacturerMutationVariables>({
                                    mutation: deleteManufacturerMutation,
                                    variables: { id: params.row.id },
                                });
                            }}
                            refetchQueries={["ManufacturersList"]}
                            copyData={() => {
                                return filterByFragment(manufacturersFragment, params.row);
                            }}
                        />
                    </>
                );
            },
        },
    ];

    const { data, loading, error } = useQuery<GQLManufacturersListQuery, GQLManufacturersListQueryVariables>(manufacturersQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(sortModel),
        },
    });
    if (error) throw error;

    const rows = data?.manufacturers.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.manufacturers.totalCount);

    return (
        <MainContent fullHeight>
            <DataGridPro
                {...dataGridProps}
                disableSelectionOnClick
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                components={{
                    Toolbar: ManufacturersGridToolbar,
                }}
            />
        </MainContent>
    );
}

const manufacturersFragment = gql`
    fragment ManufacturersListManual on Manufacturer {
        name
        address {
            street
            streetNumber
            zip
            country
            alternativeAddress {
                street
                streetNumber
                zip
                country
            }
        }
        addressAsEmbeddable {
            street
            streetNumber
            zip
            country
            alternativeAddress {
                street
                streetNumber
                zip
                country
            }
        }
    }
`;

const manufacturersQuery = gql`
    query ManufacturersList($offset: Int!, $limit: Int!, $sort: [ManufacturerSort!], $filter: ManufacturerFilter, $search: String) {
        manufacturers(offset: $offset, limit: $limit, sort: $sort, filter: $filter, search: $search) {
            nodes {
                id
                ...ManufacturersListManual
            }
            totalCount
        }
    }
    ${manufacturersFragment}
`;

const deleteManufacturerMutation = gql`
    mutation DeleteManufacturer($id: ID!) {
        deleteManufacturer(id: $id)
    }
`;

const createManufacturerMutation = gql`
    mutation CreateManufacturer($input: ManufacturerInput!) {
        createManufacturer(input: $input) {
            id
        }
    }
`;
