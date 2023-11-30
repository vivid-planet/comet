import { ArrowRight } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { DataGrid, DataGridProps, GridColDef } from "@mui/x-data-grid";
import * as React from "react";
import { FormattedDate, FormattedMessage, FormattedTime, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { DashboardWidgetRoot } from "./DashboardWidgetRoot";

type MinimalRow = {
    id: string;
    pageTreeNode?: unknown;
    name: string;
    updatedAt: string;
    editUrl?: string;
};

export type LatestContentUpdatesDashboardWidgetProps<Row extends MinimalRow> = {
    rows: DataGridProps<Row>["rows"] | undefined;
} & Pick<DataGridProps<Row>, "loading" | "error">;

export const LatestContentUpdatesDashboardWidget = <Row extends MinimalRow>({
    rows = [],
    loading,
    error,
}: LatestContentUpdatesDashboardWidgetProps<Row>) => {
    const intl = useIntl();
    const columns: GridColDef<Row>[] = [
        {
            ...disableFieldOptions,
            field: "name",
            headerName: intl.formatMessage({ id: "dashboard.latestContentUpdates.name", defaultMessage: "Page Name" }),
            flex: 1,
        },
        {
            ...disableFieldOptions,
            field: "updatedAt",
            headerName: intl.formatMessage({ id: "dashboard.latestContentUpdates.updatedAt", defaultMessage: "Updated At" }),
            type: "dateTime",
            flex: 1,
            renderCell: ({ row }) => (
                <>
                    <FormattedDate value={row.updatedAt} day="2-digit" month="2-digit" year="numeric" />
                    {", "}
                    <FormattedTime value={row.updatedAt} />
                </>
            ),
        },
        {
            ...disableFieldOptions,
            field: "editUrl",
            headerName: "",
            width: 60,
            renderCell: ({ row }) => {
                if (row.editUrl) {
                    return (
                        <IconButton component={Link} to={row.editUrl}>
                            <ArrowRight />
                        </IconButton>
                    );
                }
            },
        },
    ];

    return (
        <DashboardWidgetRoot header={<FormattedMessage id="dashboard.latestContentUpdatesWidget.title" defaultMessage="Latest Content Updates" />}>
            <DataGrid disableSelectionOnClick disableColumnMenu hideFooter autoHeight columns={columns} rows={rows} loading={loading} error={error} />
        </DashboardWidgetRoot>
    );
};

const disableFieldOptions = {
    filterable: false,
    sortable: false,
    hideable: false,
};
