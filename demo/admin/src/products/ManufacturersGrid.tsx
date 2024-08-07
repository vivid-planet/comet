import { useApolloClient, useLazyQuery, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    DataGridToolbar,
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
    GQLCopyPasteManufacturerMutation,
    GQLCopyPasteManufacturerMutationVariables,
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

    const [lazyQuery, { data: lazyData2 }] = useLazyQuery(manufacturerQuery);
    const [copyId, setCopyId] = React.useState<string>();

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
                            // onPaste={async ({ input }) => { // <- variant 2
                            onPaste={async () => {
                                // <- variant 1

                                //variant 1
                                // const lazyData = await lazyQuery({ variables: { id: copyId } });

                                // console.log(copyId);
                                // console.log("lazyData in paste", lazyData);

                                // TODO correct input data format. typename is in there, but should be removed.
                                // const data: GQLManufacturerInput = lazyData.data.manufacturer;
                                // const name = data.name;
                                // const address = data.address as GQLAddressInput;
                                // const addressAsEmbeddable = data.addressAsEmbeddable as GQLAddressAsEmbeddableInput;

                                // console.log(name);
                                // console.log(address);
                                // console.log(addressAsEmbeddable);

                                // await client.mutate<GQLCopyPasteManufacturerMutation, GQLCopyPasteManufacturerMutationVariables>({
                                //     mutation: copyPasteManufacturerMutation,
                                //     variables: {
                                //         input: {
                                //             name: data.name,
                                //             address: data.address,
                                //             addressAsEmbeddable: data.addressAsEmbeddable,
                                //         },
                                //     },
                                // });

                                //variant 2

                                // await client.mutate<GQLCopyPasteManufacturerMutation, GQLCopyPasteManufacturerMutationVariables>({
                                //     mutation: copyPasteManufacturerMutation,
                                //     variables: {
                                //         input: {
                                //             name: input.createManufacturer.name,
                                //             address: data.address,
                                //             addressAsEmbeddable: data.addressAsEmbeddable,
                                //         },
                                //     },
                                // });

                                //variant 4
                                console.log(lazyData2);

                                if (lazyData2) {
                                    await client.mutate<GQLCopyPasteManufacturerMutation, GQLCopyPasteManufacturerMutationVariables>({
                                        mutation: copyPasteManufacturerMutation,
                                        variables: {
                                            input: {
                                                name: lazyData2.name,
                                                address: lazyData2.address,
                                                addressAsEmbeddable: lazyData2.addressAsEmbeddable,
                                            },
                                        },
                                    });
                                }

                                // await client.mutate<GQLCopyPasteManufacturerMutation, GQLCopyPasteManufacturerMutationVariables>({
                                //     mutation: copyPasteManufacturerMutation,
                                //     variables: {
                                //         input: {
                                //             name: input.data.name,
                                //             address: input.data.address,
                                //             addressAsEmbeddable: input.data.addressAsEmbeddable,
                                //         },
                                //     },
                                // });
                            }}
                            onDelete={async () => {
                                await client.mutate<GQLDeleteManufacturerMutation, GQLDeleteManufacturerMutationVariables>({
                                    mutation: deleteManufacturerMutation,
                                    variables: { id: params.row.id },
                                });
                            }}
                            refetchQueries={["ManufacturersList"]}
                            copyData={async () => {
                                //variant 1
                                // setCopyId(params.row.id);
                                // return;

                                //variant 2
                                // const data = await lazyQuery({
                                //     variables: {
                                //         offset: dataGridProps.page * dataGridProps.pageSize,
                                //         limit: dataGridProps.pageSize,
                                //         filter: { name: { equal: params.row.name } }, // Id does not exist in filter, name is used for testing
                                //     },
                                // }); // load all data of entity
                                //
                                // return data.data;

                                //variant 3
                                // return params.row.id;

                                // variant 4
                                await lazyQuery({ variables: { id: params.row.id } });
                                return lazyData2; // is undefined here...

                                //original
                                // return filterByFragment(manufacturersFragment, params.row);
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

const manufacturerQuery = gql`
    query Manufacturer($id: ID!) {
        manufacturer(id: $id) {
            id
            ...ManufacturersListManual
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

const copyPasteManufacturerMutation = gql`
    mutation CopyPasteManufacturer($input: ManufacturerInput!) {
        createManufacturer(input: $input) {
            id
        }
    }
`;
