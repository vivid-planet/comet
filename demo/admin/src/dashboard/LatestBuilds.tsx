import { gql } from "@apollo/client";
import { Table, TableQuery, useTableQuery } from "@comet/admin";
import { BuildRuntime } from "@comet/cms-admin";
import { GQLLatestBuildsQuery, GQLLatestBuildsQueryVariables } from "@src/graphql.generated";
import { parseISO } from "date-fns";
import * as React from "react";
import { useIntl } from "react-intl";

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

export const LatestBuilds: React.FC = () => {
    const intl = useIntl();

    const { tableData, api, loading, error } = useTableQuery<GQLLatestBuildsQuery, GQLLatestBuildsQueryVariables>()(LATEST_BUILDS, {
        resolveTableData: (data) => ({
            data: data.builds,
            totalCount: 5,
        }),
    });

    return (
        <TableQuery api={api} loading={loading} error={error}>
            {tableData && (
                <>
                    <Table
                        {...tableData}
                        columns={[
                            {
                                name: "runtime",
                                header: intl.formatMessage({ id: "comet.pages.publisher.runtime", defaultMessage: "Runtime" }),
                                render: (row) => (
                                    <BuildRuntime
                                        startTime={row.startTime ? parseISO(row.startTime) : undefined}
                                        completionTime={row.completionTime ? parseISO(row.completionTime) : undefined}
                                    />
                                ),
                            },
                            {
                                name: "status",
                                header: intl.formatMessage({ id: "comet.pages.publisher.status", defaultMessage: "Status" }),
                            },
                        ]}
                    />
                </>
            )}
        </TableQuery>
    );
};
