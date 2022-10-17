import { gql } from "@apollo/client";
import {
    LocalErrorScopeApolloContext,
    MainContent,
    messages,
    Stack,
    Table,
    TableQuery,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarTitleItem,
    useTableQuery,
} from "@comet/admin";
import { Domain } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { parseISO } from "date-fns";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { GQLBuildsQuery } from "../graphql.generated";
import { BuildRuntime } from "./BuildRuntime";
import { PublishButton } from "./PublishButton";

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
            trigger
            startTime
            completionTime
        }
    }
`;

export function Publisher(): React.ReactElement {
    const intl = useIntl();

    const { tableData, api, loading, error } = useTableQuery<GQLBuildsQuery, undefined>()(buildsQuery, {
        resolveTableData: (data) => ({
            data: data.builds,
            totalCount: data.builds.length,
        }),
        context: LocalErrorScopeApolloContext,
    });

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

            <MainContent>
                <TableQuery api={api} loading={loading} error={error}>
                    {tableData && (
                        <>
                            <Table
                                {...tableData}
                                columns={[
                                    {
                                        name: "name",
                                        header: intl.formatMessage({ id: "comet.pages.publisher.name", defaultMessage: "Name" }),
                                    },
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
                                        name: "trigger",
                                        header: intl.formatMessage({ id: "comet.pages.publisher.trigger", defaultMessage: "Trigger" }),
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
            </MainContent>
        </Stack>
    );
}
