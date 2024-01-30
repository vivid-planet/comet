import { gql, useQuery } from "@apollo/client";
import { Loading, MainContent, Toolbar, ToolbarBackButton, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import {
    GQLKubernetesJobLogsQuery,
    GQLKubernetesJobLogsQueryVariables,
    GQLKubernetesJobQuery,
    GQLKubernetesJobQueryVariables,
} from "./JobLogs.generated";

const jobQuery = gql`
    query KubernetesJob($name: String!) {
        kubernetesJob(name: $name) {
            id
            name
            label
        }
    }
`;

function JobLogsToolbar(props: { jobName: string }) {
    const { jobName } = props;

    const { data } = useQuery<GQLKubernetesJobQuery, GQLKubernetesJobQueryVariables>(jobQuery, { variables: { name: jobName } });

    return (
        <Toolbar>
            <ToolbarBackButton />
            <ToolbarTitleItem>
                <FormattedMessage
                    id="comet.jobLogs.title"
                    defaultMessage="Job logs for {job}"
                    values={{
                        job: data?.kubernetesJob.label ? `${data?.kubernetesJob.label} (${data?.kubernetesJob.name})` : data?.kubernetesJob.name,
                    }}
                />
            </ToolbarTitleItem>
            <ToolbarFillSpace />
        </Toolbar>
    );
}

const LogsContainer = styled("pre")`
    margin: 0;
    overflow-x: auto;
`;

const logsQuery = gql`
    query KubernetesJobLogs($name: String!) {
        kubernetesJobLogs(name: $name)
    }
`;

export function JobLogs(props: { jobName: string }) {
    const { jobName } = props;

    const { loading, data, error } = useQuery<GQLKubernetesJobLogsQuery, GQLKubernetesJobLogsQueryVariables>(logsQuery, {
        variables: { name: jobName },
    });
    const logs = data?.kubernetesJobLogs;

    if (error) {
        throw error;
    }

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }

    return (
        <MainContent disablePadding>
            <JobLogsToolbar jobName={jobName} />
            {logs ? (
                <Box paddingLeft={4}>
                    <LogsContainer>{logs}</LogsContainer>
                </Box>
            ) : (
                <Box padding={4}>
                    <Typography>
                        <FormattedMessage
                            id="comet.cronJobs.noLogs"
                            defaultMessage="No logs available. You may consider checking external logging tools if available."
                        />
                    </Typography>
                </Box>
            )}
        </MainContent>
    );
}
