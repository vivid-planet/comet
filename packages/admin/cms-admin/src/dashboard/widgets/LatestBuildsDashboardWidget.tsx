import { ITableProps, Table, TableQuery, TableQueryProps } from "@comet/admin";
import { styled } from "@mui/material/styles";
import { parseISO } from "date-fns";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { BuildRuntime } from "../../builds/BuildRuntime";
import { DashboardWidgetRoot } from "./DashboardWidgetRoot";

type Row = {
    id: string;
    startTime?: string;
    completionTime?: string;
    status: string;
};

export type LatestBuildsDashboardWidgetProps = {
    tableQuery: Pick<TableQueryProps, "api" | "loading" | "error"> & {
        tableData?: Partial<ITableProps<Row>> & Pick<ITableProps<Row>, "data" | "totalCount">;
    };
};

export const LatestBuildsDashboardWidget = ({ tableQuery: { tableData, api, loading, error } }: LatestBuildsDashboardWidgetProps) => {
    const intl = useIntl();

    return (
        <DashboardWidgetRoot header={<FormattedMessage id="dashboard.latestBuildsWidget.title" defaultMessage="Latest Builds" />}>
            <TableQuery api={api} loading={loading} error={error}>
                {tableData && (
                    <Table<Row>
                        {...tableData}
                        columns={[
                            {
                                name: "runtime",
                                header: intl.formatMessage({ id: "dashboard.latestBuildsWidget.runtime", defaultMessage: "Runtime" }),
                                render: (row) => (
                                    <BuildRuntime
                                        startTime={row.startTime ? parseISO(row.startTime) : undefined}
                                        completionTime={row.completionTime ? parseISO(row.completionTime) : undefined}
                                    />
                                ),
                            },
                            {
                                name: "status",
                                header: intl.formatMessage({ id: "dashboard.latestBuildsWidget.status", defaultMessage: "Status" }),
                                render: (row) => <BuildStatus status={row.status}>{row.status}</BuildStatus>,
                            },
                        ]}
                    />
                )}
            </TableQuery>
        </DashboardWidgetRoot>
    );
};

const BuildStatus = styled("div")<{ status: string }>`
    color: ${({ theme, status }) => {
        if (status === "succeeded") {
            return theme.palette.success.main;
        } else if (status === "failed") {
            return theme.palette.error.main;
        }

        return theme.palette.primary.main;
    }};
`;
