import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    Button,
    DataGridToolbar,
    FillSpace,
    GridCellContent,
    GridColDef,
    messages,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    ToolbarActions,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { ReactElement } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
    GQLDamMediaAlternativeGridFragment,
    GQLDamMediaAlternativesQuery,
    GQLDamMediaAlternativesQueryVariables,
    GQLDeleteDamMediaAlternativeMutation,
    GQLDeleteDamMediaAlternativeMutationVariables,
} from "./MediaAlternativesGrid.generated";

const damMediaAlternativeFragment = gql`
    fragment DamMediaAlternativeGrid on DamMediaAlternative {
        id
        language
        type
        for {
            id
            name
            damPath
        }
        alternative {
            id
            name
            damPath
        }
    }
`;

const damMediaAlternativesQuery = gql`
    query DamMediaAlternatives($offset: Int!, $limit: Int!, $sort: [DamMediaAlternativeSort!], $search: String, $filter: DamMediaAlternativeFilter) {
        damMediaAlternatives(offset: $offset, limit: $limit, sort: $sort, search: $search, filter: $filter) {
            nodes {
                ...DamMediaAlternativeGrid
            }
            totalCount
        }
    }
    ${damMediaAlternativeFragment}
`;

const deleteDamMediaAlternativeMutation = gql`
    mutation DeleteDamMediaAlternative($id: ID!) {
        deleteDamMediaAlternative(id: $id)
    }
`;

function MediaAlternativesGridToolbar() {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <FillSpace />
            <ToolbarActions>
                <Button responsive startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
                    <FormattedMessage {...messages.add} />
                </Button>
            </ToolbarActions>
        </DataGridToolbar>
    );
}

interface MediaAlternativesGridProps {
    file: { id: string };
}

export function MediaAlternativesGrid({ file }: MediaAlternativesGridProps): ReactElement {
    const client = useApolloClient();
    const intl = useIntl();
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("DamMediaAlternativesGrid") };

    const columns: GridColDef<GQLDamMediaAlternativeGridFragment>[] = [
        {
            field: "file",
            headerName: intl.formatMessage({ id: "damMediaAlternatives.title", defaultMessage: "File" }),
            flex: 1,
            minWidth: 150,
            renderCell: ({ row }) => <GridCellContent primaryText={row.for.name} secondaryText={row.for.damPath} />,
        },
        {
            field: "language",
            headerName: intl.formatMessage({ id: "damMediaAlternatives.language", defaultMessage: "Language" }),
            flex: 1,
            minWidth: 50,
        },
        {
            field: "actions",
            headerName: "",
            sortable: false,
            filterable: false,
            type: "actions",
            align: "right",
            pinned: "right",
            width: 84,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id}>
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={async () => {
                                await client.mutate<GQLDeleteDamMediaAlternativeMutation, GQLDeleteDamMediaAlternativeMutationVariables>({
                                    mutation: deleteDamMediaAlternativeMutation,
                                    variables: { id: params.row.id },
                                    refetchQueries: [damMediaAlternativesQuery],
                                });
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    const { filter: gqlFilter, search: gqlSearch } = muiGridFilterToGql(columns, dataGridProps.filterModel);

    const { data, loading, error } = useQuery<GQLDamMediaAlternativesQuery, GQLDamMediaAlternativesQueryVariables>(damMediaAlternativesQuery, {
        variables: {
            filter: gqlFilter,
            search: gqlSearch,
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(dataGridProps.sortModel),
        },
    });
    const rowCount = useBufferedRowCount(data?.damMediaAlternatives.totalCount);
    if (error) throw error;
    const rows = data?.damMediaAlternatives.nodes ?? [];

    return (
        <DataGrid
            {...dataGridProps}
            autoHeight={true}
            disableSelectionOnClick
            rows={rows}
            rowCount={rowCount}
            columns={columns}
            loading={loading}
            components={{
                Toolbar: MediaAlternativesGridToolbar,
            }}
        />
    );
}
