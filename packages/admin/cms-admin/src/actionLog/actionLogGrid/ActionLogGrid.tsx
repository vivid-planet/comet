import { useQuery } from "@apollo/client";
import {
    ActionLogHeader,
    type GridColDef,
    muiGridFilterToGql,
    muiGridSortToGql,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { View } from "@comet/admin-icons";
import { IconButton, Typography } from "@mui/material";
import { DataGridPro, gridClasses, type GridRowSelectionModel, type GridSlotsComponent } from "@mui/x-data-grid-pro";
//import { ActionLogHeader } from "@src/actionLog/components/header/ActionLogHeader";
import { type FunctionComponent, useState } from "react";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";

import { ActionGridToolbar, type ActionGridToolbarProps } from "./actionGridToolbar/ActionGridToolbar";
import { actionLogGridQuery } from "./ActionLogGrid.gql";
import {
    type GQLActionLogGridFragmentFragment,
    type GQLActionLogGridQuery,
    type GQLActionLogGridQueryVariables,
} from "./ActionLogGrid.gql.generated";
import { Root } from "./ActionLogGrid.sc";
import { UserCell } from "./userCell/UserCell";

type ActionGridRow = GQLActionLogGridFragmentFragment;

type ActionLogGridProps = {
    id: string;

    /**
     * latest name of the actual object which will be displayed in the title
     */
    name?: string;
    onClick: (versionId: string) => void;
    onCompareVersionsClick: (versionId: string, versionsId2: string) => void;
};

export const ActionLogGrid: FunctionComponent<ActionLogGridProps> = ({ id, name, onClick, onCompareVersionsClick }) => {
    const intl = useIntl();
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);

    const dataGridRemote = useDataGridRemote({ initialSort: [{ field: "version", sort: "desc" }] });
    const dataGridPersistent = usePersistentColumnState("ActionLogGrid");
    const dataGridProps = { ...dataGridRemote, ...dataGridPersistent };
    const columns: GridColDef<ActionGridRow>[] = [
        {
            field: "version",
            headerName: intl.formatMessage({ defaultMessage: "Version", id: "actionLog.actionLogGrid.columns.version" }),
        },
        {
            field: "createdAt",
            headerName: intl.formatMessage({ defaultMessage: "Datum", id: "actionLog.actionLogGrid.columns.createdAt" }),
            minWidth: 200,
            renderCell: ({ row }) => {
                return <FormattedDate dateStyle="medium" timeStyle="short" value={row.createdAt} />;
            },
        },
        {
            field: "userId",
            headerName: intl.formatMessage({ defaultMessage: "Geändert von", id: "actionLog.actionLogGrid.columns.userId" }),
            minWidth: 400,
            renderCell: ({ row }) => {
                return <UserCell name={row.userId} />;
            },
        },
        {
            align: "right",
            field: "actions",
            filterable: false,
            headerName: intl.formatMessage({ defaultMessage: "Actions", id: "actionLog.actionLogGrid.columns.actions" }),
            pinned: "right",
            width: 60,
            renderCell: ({ row }) => {
                return (
                    <IconButton
                        color="primary"
                        onClick={() => {
                            onClick(row.id);
                        }}
                    >
                        <View />
                    </IconButton>
                );
            },
            renderHeader: () => {
                return null;
            },
            sortable: false,
            type: "actions",
        },
    ];

    const { filter: gqlFilter } = muiGridFilterToGql(columns, dataGridProps.filterModel);

    const { data, error, loading } = useQuery<GQLActionLogGridQuery, GQLActionLogGridQueryVariables>(actionLogGridQuery, {
        variables: {
            filter: {
                and: [
                    ...(gqlFilter.and != null ? gqlFilter.and : []),
                    {
                        entityId: {
                            equal: id,
                        },
                    },
                ],
                or: gqlFilter.or,
            },
            limit: dataGridProps.paginationModel.pageSize,
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
            sort: muiGridSortToGql(dataGridProps.sortModel),
        },
    });

    const rowCount = useBufferedRowCount(data?.actionLogs.totalCount);

    if (error) throw error;

    const toolbarProps: ActionGridToolbarProps = {
        disableCompare: selectionModel.length < 2,
        onClickCompare: () => {
            if (selectionModel.length >= 2) {
                onCompareVersionsClick(selectionModel[0].toString(), selectionModel[1].toString());
            }
        },
    };

    return (
        <Root>
            <ActionLogHeader
                action={
                    <Typography variant="caption">
                        <FormattedMessage
                            defaultMessage="Es können jeweils nur 2 Versionen verglichen werden."
                            id="actionLog.actionLogGrid.info.onlyCompare2Versions"
                        />
                    </Typography>
                }
                dbTypes={Array.from(
                    new Set(
                        data?.actionLogs.nodes.map((value) => {
                            return value.entityName;
                        }),
                    ),
                )}
                id={id}
                title={
                    <FormattedMessage
                        defaultMessage="Versionshistorie{name}"
                        id="actionLog.actionLogGrid.title"
                        values={{
                            name: name != null ? ` - ${name}` : "",
                        }}
                    />
                }
            />

            <DataGridPro
                sx={{
                    // Hide Column Header - Select All Checkbox
                    [`& .${gridClasses.columnHeaderCheckbox} .${gridClasses.columnHeaderTitleContainer}`]: {
                        display: "none",
                    },
                }}
                {...dataGridProps}
                checkboxSelection={true}
                columns={columns}
                isRowSelectable={(params) => {
                    if (selectionModel.includes(params.row.id)) {
                        return true;
                    }

                    return selectionModel.length < 2;
                }}
                loading={loading}
                onRowSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel);
                }}
                pinnedColumns={{ right: ["actions"] }}
                rowCount={rowCount}
                rows={data?.actionLogs.nodes ?? []}
                rowSelectionModel={selectionModel}
                slotProps={{
                    toolbar: toolbarProps,
                }}
                slots={{
                    toolbar: ActionGridToolbar as GridSlotsComponent["toolbar"],
                }}
            />
        </Root>
    );
};
