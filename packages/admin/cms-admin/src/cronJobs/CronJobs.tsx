import { gql } from "@apollo/client";
import {
    LocalErrorScopeApolloContext,
    MainContent,
    messages,
    Stack,
    Table,
    TableQuery,
    Toolbar,
    ToolbarFillSpace,
    ToolbarTitleItem,
    useTableQuery,
} from "@comet/admin";
import { Domain } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedDate, FormattedMessage, FormattedTime, useIntl } from "react-intl";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { GQLCronJobsQuery } from "../graphql.generated";

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

    const { tableData, api, loading, error } = useTableQuery<GQLCronJobsQuery, undefined>()(cronJobsQuery, {
        resolveTableData: (data) => ({
            data: data.cronJobs,
            totalCount: data.cronJobs.length,
        }),
        context: LocalErrorScopeApolloContext,
    });

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

            <MainContent>
                <TableQuery api={api} loading={loading} error={error}>
                    {tableData && (
                        <>
                            <Table
                                {...tableData}
                                columns={[
                                    {
                                        name: "name",
                                        header: intl.formatMessage({ id: "comet.pages.cronJobs.name", defaultMessage: "Name" }),
                                    },
                                    {
                                        name: "schedule",
                                        header: intl.formatMessage({ id: "comet.pages.cronJobs.name", defaultMessage: "Schedule" }),
                                    },
                                    {
                                        name: "lastScheduledAt",
                                        header: intl.formatMessage({
                                            id: "comet.pages.cronJobs.lastScheduledAt",
                                            defaultMessage: "Last Scheduled At",
                                        }),
                                        render: (row) =>
                                            row.lastScheduledAt && (
                                                <div>
                                                    <FormattedDate value={row.lastScheduledAt} day="2-digit" month="2-digit" year="numeric" />
                                                    {", "}
                                                    <FormattedTime value={row.lastScheduledAt} />
                                                </div>
                                            ),
                                    },
                                ]}
                            />
                        </>
                    )}
                </TableQuery>
            </MainContent>
        </Stack>
    );
}
