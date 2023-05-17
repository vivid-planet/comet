import { gql, useQuery } from "@apollo/client";
import { messages, Stack, Toolbar, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Domain } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { GQLCronJobsQuery } from "./CronJobsPage.generated";

const ScopeIndicatorLabelBold = styled(Typography)`
    && {
        font-weight: 400;
        padding: 0 8px 0 4px;
        text-transform: uppercase;
    }
`;

const ScopeIndicatorContent = styled("div")`
    display: flex;
    align-items: center;
`;

const DataGridContainer = styled("div")`
    width: 100%;
    height: calc(100vh - var(--comet-admin-master-layout-content-top-spacing));
`;

const cronJobsQuery = gql`
    query CronJobs {
        cronJobs {
            id
            name
            schedule
            lastScheduledAt
        }
    }
`;

export function CronJobsPage(): React.ReactElement {
    const intl = useIntl();

    const { data, loading, error } = useQuery<GQLCronJobsQuery, undefined>(cronJobsQuery);

    const rows = data?.cronJobs ?? [];

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.pages.cronJobs", defaultMessage: "Cron Jobs" })}>
            <ContentScopeIndicator variant="toolbar">
                <ScopeIndicatorContent>
                    <Domain fontSize="small" />
                    <ScopeIndicatorLabelBold variant="body2">
                        <FormattedMessage {...messages.globalContentScope} />
                    </ScopeIndicatorLabelBold>
                </ScopeIndicatorContent>
            </ContentScopeIndicator>
            <Toolbar>
                <ToolbarTitleItem>
                    <FormattedMessage id="comet.cronJobs.title" defaultMessage="Cron Jobs" />
                </ToolbarTitleItem>
                <ToolbarFillSpace />
            </Toolbar>
            <DataGridContainer>
                <DataGrid
                    rows={rows}
                    loading={loading}
                    error={error}
                    columns={[
                        {
                            field: "name",
                            headerName: intl.formatMessage({ id: "comet.pages.cronJobs.name", defaultMessage: "Name" }),
                            flex: 1,
                        },
                        {
                            field: "schedule",
                            headerName: intl.formatMessage({ id: "comet.pages.cronJobs.schedule", defaultMessage: "Schedule" }),
                            flex: 1,
                        },
                    ]}
                    disableColumnSelector
                />
            </DataGridContainer>
        </Stack>
    );
}
