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
    ToolbarActions,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    useEditDialog,
    usePersistentColumnState,
} from "@comet/admin";
import { DeleteDialog } from "@comet/admin/lib/common/DeleteDialog";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { ReactElement, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GQLDamMediaAlternativeType } from "../../graphql.generated";
import { MediaAlternativeForm } from "./MediaAlternativeForm";
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
    query DamMediaAlternatives(
        $offset: Int!
        $limit: Int!
        $sort: [DamMediaAlternativeSort!]
        $search: String
        $filter: DamMediaAlternativeFilter
        $for: ID
        $alternative: ID
        $type: DamMediaAlternativeType
    ) {
        damMediaAlternatives(
            offset: $offset
            limit: $limit
            sort: $sort
            search: $search
            filter: $filter
            for: $for
            alternative: $alternative
            type: $type
        ) {
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

function MediaAlternativesGridToolbar({ handleAdd }: { handleAdd: () => void }) {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <FillSpace />
            <ToolbarActions>
                <Button responsive startIcon={<AddIcon />} onClick={handleAdd}>
                    <FormattedMessage {...messages.add} />
                </Button>
            </ToolbarActions>
        </DataGridToolbar>
    );
}

interface MediaAlternativesGridProps {
    file: { id: string };
    type: GQLDamMediaAlternativeType;
}

export function MediaAlternativesGrid({ file, type }: MediaAlternativesGridProps): ReactElement {
    const client = useApolloClient();
    const intl = useIntl();
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("DamMediaAlternativesGrid") };
    const [EditDialog, selection, editDialogApi, selectionApi] = useEditDialog();
    const [deleteId, setDeleteId] = useState<string | undefined>();

    const columns: GridColDef<GQLDamMediaAlternativeGridFragment>[] = [
        {
            field: "file",
            headerName: intl.formatMessage({ id: "damMediaAlternatives.title", defaultMessage: "File" }),
            flex: 1,
            minWidth: 150,
            renderCell: ({ row }) => <GridCellContent primaryText={row.alternative.name} secondaryText={row.alternative.damPath} />,
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
                        <IconButton
                            color="primary"
                            onClick={() => {
                                editDialogApi.openEditDialog(params.row.id);
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                setDeleteId(params.row.id);
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
            for: file.id,
            type: type,
        },
    });
    const rowCount = useBufferedRowCount(data?.damMediaAlternatives.totalCount);
    if (error) throw error;
    const rows = data?.damMediaAlternatives.nodes ?? [];

    return (
        <>
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
                componentsProps={{
                    toolbar: {
                        handleAdd: () => editDialogApi.openAddDialog(file.id),
                    },
                }}
            />
            <EditDialog>
                {selection.id && selection.mode ? (
                    <MediaAlternativeForm
                        mode={selection.mode}
                        id={selection.mode === "edit" ? selection.id : undefined}
                        fileId={file.id}
                        selectionApi={selectionApi}
                        type={type}
                    />
                ) : null}
            </EditDialog>
            <DeleteDialog
                dialogOpen={deleteId !== undefined}
                onCancel={() => setDeleteId(undefined)}
                onDelete={async () => {
                    if (deleteId) {
                        await client.mutate<GQLDeleteDamMediaAlternativeMutation, GQLDeleteDamMediaAlternativeMutationVariables>({
                            mutation: deleteDamMediaAlternativeMutation,
                            variables: { id: deleteId },
                            refetchQueries: [damMediaAlternativesQuery],
                        });
                    }
                    setDeleteId(undefined);
                }}
            />
        </>
    );
}
