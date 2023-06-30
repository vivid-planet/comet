import { ITableProps, Table, TableQuery, TableQueryProps } from "@comet/admin";
import { ArrowRight } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import * as React from "react";
import { FormattedDate, FormattedMessage, FormattedTime, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { DashboardWidgetRoot } from "./DashboardWidgetRoot";

type Row = {
    id: string;
    pageTreeNode?: unknown;
    name: string;
    updatedAt: string;
};

export type LatestContentUpdatesDashboardWidgetProps = {
    tableQuery: Pick<TableQueryProps, "api" | "loading" | "error"> & {
        tableData?: Partial<ITableProps<Row>> & Pick<ITableProps<Row>, "data" | "totalCount">;
    };
    getUrlFromPageTreeNode?: (row: unknown) => string;
};

export const LatestContentUpdatesDashboardWidget = ({
    tableQuery: { tableData, api, loading, error },
    getUrlFromPageTreeNode,
}: LatestContentUpdatesDashboardWidgetProps) => {
    const intl = useIntl();

    return (
        <DashboardWidgetRoot header={<FormattedMessage id="dashboard.latestContentUpdatesWidget.title" defaultMessage="Latest Content Updates" />}>
            <TableQuery api={api} loading={loading} error={error}>
                {tableData && (
                    <Table<Row>
                        {...tableData}
                        columns={[
                            {
                                name: "name",
                                header: intl.formatMessage({ id: "dashboard.latestContentUpdates.name", defaultMessage: "Page Name" }),
                            },
                            {
                                name: "updatedAt",
                                header: intl.formatMessage({ id: "dashboard.latestContentUpdates.updatedAt", defaultMessage: "Updated At" }),
                                render: (row) => (
                                    <div>
                                        <FormattedDate value={row.updatedAt} day="2-digit" month="2-digit" year="numeric" />
                                        {", "}
                                        <FormattedTime value={row.updatedAt} />
                                    </div>
                                ),
                            },
                            {
                                name: "jumpTo",
                                cellProps: { align: "right" },
                                render: (row) => {
                                    if (!row || !getUrlFromPageTreeNode) {
                                        return null;
                                    }

                                    return (
                                        <IconButton component={Link} to={getUrlFromPageTreeNode(row)}>
                                            <ArrowRight />
                                        </IconButton>
                                    );
                                },
                            },
                        ]}
                    />
                )}
            </TableQuery>
        </DashboardWidgetRoot>
    );
};
