import { gql, useQuery } from "@apollo/client";
import { messages, Stack, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Domain } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { parseISO } from "date-fns";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { JobRuntime } from "../cronJobs/JobRuntime";
import { PublishButton } from "./PublishButton";
import { GQLBuildsQuery } from "./PublisherPage.generated";

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

const buildsQuery = gql`
    query Builds {
        builds {
            id
            status
            name
            label
            trigger
            startTime
            completionTime
        }
    }
`;

const DataGridContainer = styled("div")`
    width: 100%;
    height: calc(100vh - var(--comet-admin-master-layout-content-top-spacing));
`;

export function PublisherPage(): React.ReactElement {
    const intl = useIntl();

    const { data, loading, error } = useQuery<GQLBuildsQuery, undefined>(buildsQuery);

    const rows = data?.builds ?? [];

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.pages.publisher", defaultMessage: "Publisher" })}>
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
                    <FormattedMessage id="comet.publisher.title" defaultMessage="Publisher" />
                </ToolbarTitleItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <PublishButton />
                </ToolbarActions>
            </Toolbar>

            <DataGridContainer>
                <DataGrid
                    rows={rows}
                    loading={loading}
                    error={error}
                    columns={[
                        {
                            field: "name",
                            headerName: intl.formatMessage({ id: "comet.pages.publisher.name", defaultMessage: "Name" }),
                            flex: 2,
                            renderCell: ({ row }) => {
                                return row.label && row.label.length > 0 ? row.label : row.name;
                            },
                        },
                        {
                            field: "runtime",
                            headerName: intl.formatMessage({ id: "comet.pages.publisher.runtime", defaultMessage: "Runtime" }),
                            valueGetter: (params) => {
                                return {
                                    startTime: params.row.startTime,
                                    completionTime: params.row.completionTime,
                                };
                            },
                            renderCell: (params) => {
                                return (
                                    <JobRuntime
                                        startTime={params.value.startTime ? parseISO(params.value.startTime) : undefined}
                                        completionTime={params.value.completionTime ? parseISO(params.value.completionTime) : undefined}
                                    />
                                );
                            },
                            flex: 2,
                        },
                        {
                            field: "trigger",
                            headerName: intl.formatMessage({ id: "comet.pages.publisher.trigger", defaultMessage: "Trigger" }),
                            flex: 1,
                        },
                        {
                            field: "status",
                            headerName: intl.formatMessage({ id: "comet.pages.publisher.status", defaultMessage: "Status" }),
                            flex: 1,
                        },
                    ]}
                    disableColumnSelector
                />
            </DataGridContainer>
        </Stack>
    );
}
