import { gql, useQuery } from "@apollo/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { parseISO } from "date-fns";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { JobRuntime } from "../../cronJobs/JobRuntime";
import { JobStatus } from "../../cronJobs/JobStatus";
import { DashboardWidgetRoot } from "./DashboardWidgetRoot";
import { GQLLatestBuildsQuery, GQLLatestBuildsQueryVariables } from "./LatestBuildsDashboardWidget.generated";

export const LatestBuildsDashboardWidget = () => {
    const { data, loading, error } = useQuery<GQLLatestBuildsQuery, GQLLatestBuildsQueryVariables>(LATEST_BUILDS);
    const intl = useIntl();

    const columns: GridColDef<GQLLatestBuildsQuery["builds"][number]>[] = [
        {
            ...disableFieldOptions,
            field: "runtime",
            headerName: intl.formatMessage({ id: "dashboard.latestBuildsWidget.runtime", defaultMessage: "Runtime" }),
            flex: 1,
            renderCell: ({ row }) => (
                <JobRuntime
                    startTime={row.startTime ? parseISO(row.startTime) : undefined}
                    completionTime={row.completionTime ? parseISO(row.completionTime) : undefined}
                />
            ),
        },
        {
            ...disableFieldOptions,
            field: "status",
            headerName: intl.formatMessage({ id: "dashboard.latestBuildsWidget.status", defaultMessage: "Status" }),
            width: 150,
            renderCell: ({ row }) => <JobStatus status={row.status}>{row.status}</JobStatus>,
        },
    ];

    return (
        <DashboardWidgetRoot header={<FormattedMessage id="dashboard.latestBuildsWidget.title" defaultMessage="Latest Builds" />}>
            <DataGrid
                disableSelectionOnClick
                disableColumnMenu
                hideFooter
                autoHeight
                columns={columns}
                rows={data?.builds ?? []}
                loading={loading}
                error={error}
            />
        </DashboardWidgetRoot>
    );
};

const disableFieldOptions = {
    filterable: false,
    sortable: false,
    hideable: false,
};

const LATEST_BUILDS = gql`
    query LatestBuilds {
        builds(limit: 5) {
            id
            status
            name
            trigger
            startTime
            completionTime
        }
    }
`;
