import { gql, useQuery } from "@apollo/client";
import { FillSpace, Loading, MainContent, Toolbar, ToolbarBackButton, ToolbarTitleItem } from "@comet/admin";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";

import { GQLKubernetesJobWithLogsQuery, GQLKubernetesJobWithLogsQueryVariables } from "./JobLogs.generated";

function JobLogsToolbar(props: { kubernetesJob?: { name: string; label: string | null } }) {
    const { kubernetesJob } = props;
    if (!kubernetesJob) {
        return null;
    }

    return (
        <Toolbar>
            <ToolbarBackButton />
            <ToolbarTitleItem>
                <FormattedMessage
                    id="comet.jobLogs.title"
                    defaultMessage="Job logs for {job}"
                    values={{
                        job: kubernetesJob.label ? `${kubernetesJob.label} (${kubernetesJob.name})` : kubernetesJob.name,
                    }}
                />
            </ToolbarTitleItem>
            <FillSpace />
        </Toolbar>
    );
}

const LogsContainer = styled("pre")`
    margin: 0;
    overflow-x: auto;
`;

const jobWithLogsQuery = gql`
    query KubernetesJobWithLogs($name: String!) {
        kubernetesJob(name: $name) {
            id
            name
            label
        }
        kubernetesJobLogs(name: $name)
    }
`;

export function JobLogs(props: { jobName: string }) {
    const { jobName } = props;

    const { loading, data, error } = useQuery<GQLKubernetesJobWithLogsQuery, GQLKubernetesJobWithLogsQueryVariables>(jobWithLogsQuery, {
        variables: { name: jobName },
    });

    if (error) {
        throw error;
    }

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }

    const logs = data?.kubernetesJobLogs;
    const job = data?.kubernetesJob;

    return (
        <MainContent disablePadding>
            <JobLogsToolbar kubernetesJob={job} />
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
