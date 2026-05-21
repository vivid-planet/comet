import { type GridColDef, useBufferedRowCount, type useDataGridRemote, type usePersistentColumnState } from "@comet/admin";
import { View } from "@comet/admin-icons";
import { IconButton, Typography } from "@mui/material";
import { DataGrid, gridClasses, type GridRowSelectionModel, type GridSlotsComponent } from "@mui/x-data-grid";
import { type FunctionComponent, useMemo, useState } from "react";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";

import { ActionLogHeader } from "../components/header/ActionLogHeader";
import { ActionGridToolbar, type ActionGridToolbarProps } from "./actionGridToolbar/ActionGridToolbar";
import type { GQLActionLogGridFragmentFragment } from "./ActionLogGrid.gql.generated";
import { Root } from "./ActionLogGrid.sc";
import { UserCell } from "./userCell/UserCell";

type ActionGridRow = GQLActionLogGridFragmentFragment;

type ActionLogGridProps = ReturnType<typeof useDataGridRemote> &
    ReturnType<typeof usePersistentColumnState> & {
        actionLogs: { nodes: ActionGridRow[]; totalCount: number } | undefined;
        id: string;
        loading: boolean;
        /**
         * Latest name of the actual object, displayed in the title
         */
        name?: string;
        onShowVersionClick: (versionId: string) => void;
        onCompareVersionsClick: (versionId: string, versionsId2: string) => void;
    };

export const ActionLogGrid: FunctionComponent<ActionLogGridProps> = ({
    actionLogs,
    id,
    loading,
    name,
    onShowVersionClick,
    onCompareVersionsClick,
    ...dataGridProps
}) => {
    const intl = useIntl();
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({ type: "include", ids: new Set() });

    const columns = useMemo<GridColDef<ActionGridRow>[]>(
        () => [
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
                                onShowVersionClick(row.id);
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
        ],
        [intl, onShowVersionClick],
    );

    const rowCount = useBufferedRowCount(actionLogs?.totalCount);

    const selectedIds = Array.from(selectionModel.ids);
    const toolbarProps: ActionGridToolbarProps = {
        disableCompare: selectionModel.ids.size < 2,
        onClickCompare: () => {
            if (selectionModel.ids.size >= 2) {
                onCompareVersionsClick(selectedIds[0].toString(), selectedIds[1].toString());
            }
        },
    };

    return (
        <Root>
            <ActionLogHeader
                action={
                    <Typography variant="caption">
                        <FormattedMessage
                            defaultMessage="You can only compare 2 versions at a time."
                            id="actionLog.actionLogGrid.info.onlyCompare2Versions"
                        />
                    </Typography>
                }
                dbTypes={Array.from(
                    new Set(
                        actionLogs?.nodes.map((value) => {
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

            <DataGrid
                sx={{
                    // Hide Column Header - Select All Checkbox
                    [`& .${gridClasses.columnHeaderCheckbox} .${gridClasses.columnHeaderTitleContainer}`]: {
                        display: "none",
                    },
                }}
                {...dataGridProps}
                checkboxSelection={true}
                showToolbar
                columns={columns}
                isRowSelectable={(params) => {
                    if (selectionModel.ids.has(params.row.id)) {
                        return true;
                    }

                    return selectionModel.ids.size < 2;
                }}
                loading={loading}
                onRowClick={({ row }) => onShowVersionClick(row.id)}
                onRowSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel);
                }}
                rowCount={rowCount}
                rows={actionLogs?.nodes ?? []}
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
export { actionLogGridFragment } from "./ActionLogGrid.gql";
