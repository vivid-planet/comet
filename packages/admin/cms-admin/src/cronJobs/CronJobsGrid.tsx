import { gql, useApolloClient, useQuery } from "@apollo/client";
import { MainContent, StackLink, Toolbar, ToolbarFillSpace, ToolbarTitleItem, useStackSwitchApi } from "@comet/admin";
import { Play, Time } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { parseISO } from "date-fns";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
    GQLKubernetesCronJobsQuery,
    GQLKubernetesCronJobsQueryVariables,
    GQLTriggerKubernetesCronJobMutation,
    GQLTriggerKubernetesCronJobMutationVariables,
} from "./CronJobsGrid.generated";
import { JobRuntime } from "./JobRuntime";
import { JobStatus } from "./JobStatus";

const disableFieldOptions = {
    filterable: false,
    sortable: false,
    hideable: false,
};

const cronJobsQuery = gql`
    query KubernetesCronJobs {
        kubernetesCronJobs {
            id
            name
            label
            schedule
            lastScheduledAt
            lastJobRun {
                id
                name
                startTime
                completionTime
                status
            }
        }
    }
`;

const triggerCronJobMutation = gql`
    mutation TriggerKubernetesCronJob($name: String!) {
        triggerKubernetesCronJob(name: $name) {
            id
            name
        }
    }
`;

function CronJobsToolbar() {
    return (
        <Toolbar>
            <ToolbarTitleItem>
                <FormattedMessage id="comet.cronJobs.title" defaultMessage="Cron Jobs" />
            </ToolbarTitleItem>
            <ToolbarFillSpace />
        </Toolbar>
    );
}

export function CronJobsGrid() {
    const intl = useIntl();
    const client = useApolloClient();
    const stackSwitchApi = useStackSwitchApi();

    const { data, loading, error } = useQuery<GQLKubernetesCronJobsQuery, GQLKubernetesCronJobsQueryVariables>(cronJobsQuery);

    const rows = data?.kubernetesCronJobs ?? [];

    return (
        <MainContent disablePadding fullHeight>
            <DataGrid
                rows={rows}
                loading={loading}
                error={error}
                hideFooterPagination
                columns={[
                    {
                        field: "name",
                        headerName: intl.formatMessage({ id: "comet.pages.cronJobs.name", defaultMessage: "Name" }),
                        flex: 2,
                        ...disableFieldOptions,
                        valueGetter: ({ row }) => {
                            return {
                                name: row.name,
                                label: row.label,
                            };
                        },
                        renderCell: ({ value }) => {
                            return value.label ? `${value.label} (${value.name})` : value.name;
                        },
                    },
                    {
                        field: "schedule",
                        headerName: intl.formatMessage({ id: "comet.pages.cronJobs.schedule", defaultMessage: "Schedule" }),
                        flex: 1,
                        ...disableFieldOptions,
                    },
                    {
                        field: "lastJobRun",
                        headerName: intl.formatMessage({ id: "comet.pages.cronJobs.lastJobRun", defaultMessage: "Last Job Run" }),
                        flex: 2,
                        renderCell: ({ value }) => {
                            return value ? (
                                <>
                                    <JobStatus status={value.status}>{value.status}</JobStatus>
                                    {", "}
                                    <JobRuntime
                                        startTime={value.startTime ? parseISO(value.startTime) : undefined}
                                        completionTime={value.completionTime ? parseISO(value.completionTime) : undefined}
                                    />
                                </>
                            ) : (
                                <FormattedMessage id="comet.pages.cronJobs.never" defaultMessage="Never" />
                            );
                        },
                        ...disableFieldOptions,
                    },
                    {
                        field: "actions",
                        headerName: "",
                        renderCell: ({ row }) => (
                            <>
                                <IconButton component={StackLink} pageName="jobs" payload={row.name}>
                                    <Time color="primary" />
                                </IconButton>
                                <IconButton>
                                    <Play
                                        color="primary"
                                        onClick={async () => {
                                            await client.mutate<GQLTriggerKubernetesCronJobMutation, GQLTriggerKubernetesCronJobMutationVariables>({
                                                mutation: triggerCronJobMutation,
                                                variables: { name: row.name },
                                            });
                                            stackSwitchApi.activatePage("jobs", row.name);
                                        }}
                                    />
                                </IconButton>
                            </>
                        ),
                        ...disableFieldOptions,
                    },
                ]}
                disableColumnSelector
                components={{ Toolbar: CronJobsToolbar }}
            />
        </MainContent>
    );
}
