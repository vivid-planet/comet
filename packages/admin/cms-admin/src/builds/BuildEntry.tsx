import { gql, useQuery } from "@apollo/client";
import { LocalErrorScopeApolloContext, useFocusAwarePolling } from "@comet/admin";
import { SsgRunning, SsgStandby } from "@comet/admin-icons";
import { List, ListItem, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { differenceInMinutes, parseISO } from "date-fns";
import * as React from "react";
import { FormattedMessage, FormattedTime } from "react-intl";

import { DropdownMenuItem } from "../common/DropdownMenuItem";
import { GQLBuildStatusQuery } from "./BuildEntry.generated";
import { PublishButton } from "./PublishButton";

const buildStatusQuery = gql`
    query BuildStatus {
        autoBuildStatus {
            hasChangesSinceLastBuild
            lastCheck
            nextCheck
        }
        builds(limit: 1) {
            id
            status
            name
            trigger
            startTime
            completionTime
            estimatedCompletionTime
        }
    }
`;

const BuildStatusPopperContent: React.FunctionComponent<{ data: GQLBuildStatusQuery }> = ({ data: { autoBuildStatus, builds } }) => {
    const content: React.ReactNode[] = [];
    const lastBuild = builds.length > 0 ? builds[0] : undefined;

    if (lastBuild) {
        if (lastBuild.status === "active" || lastBuild.status === "pending") {
            let remainingRuntime: number | undefined;

            if (lastBuild.estimatedCompletionTime) {
                remainingRuntime = Math.abs(differenceInMinutes(parseISO(lastBuild.estimatedCompletionTime), new Date()));
            }

            content.push(
                <Typography variant="body2">
                    <FormattedMessage id="comet.header.buildStatus.buildRunning" defaultMessage="Publication is in progress." />
                    {remainingRuntime !== undefined && (
                        <>
                            {" "}
                            <FormattedMessage
                                id="comet.header.buildStatus.estimatedCompletion"
                                defaultMessage="Estimated time to finish: {remainingRuntime, plural,
                                    =0 {< 1 min}
                                    other {± # min}
                                }"
                                values={{ remainingRuntime }}
                            />
                        </>
                    )}
                </Typography>,
            );
        } else if (autoBuildStatus.hasChangesSinceLastBuild) {
            const nextCheck = parseISO(autoBuildStatus.nextCheck);

            content.push(
                <Typography variant="body2">
                    <FormattedMessage
                        id="comet.header.buildStatus.nextScheduledBuild"
                        defaultMessage="New content changes found. Next publication is planned for: "
                    />{" "}
                    <FormattedTime value={nextCheck} />
                </Typography>,
            );
            content.push(<PublishButton />);
        }

        if (lastBuild.status === "failed") {
            content.push(
                <Typography variant="body2" color="error">
                    <FormattedMessage id="comet.header.buildStatus.lastBuildFailure" defaultMessage="Last publication failed" />
                </Typography>,
            );
        }
    }

    if (!autoBuildStatus.hasChangesSinceLastBuild) {
        content.push(
            <Typography variant="body2">
                <FormattedMessage id="comet.header.buildStatus.noChanges" defaultMessage="No new content changes" />
            </Typography>,
        );
    }

    return (
        <>
            {content.map((item, index) => (
                <ListItem key={index} dense={false} divider={index !== content.length - 1}>
                    {item}
                </ListItem>
            ))}
        </>
    );
};

export function BuildEntry(): React.ReactElement {
    const { data, error, refetch, startPolling, stopPolling } = useQuery<GQLBuildStatusQuery>(buildStatusQuery, {
        skip: process.env.NODE_ENV === "development",
        fetchPolicy: "network-only",
        context: LocalErrorScopeApolloContext,
    });

    useFocusAwarePolling({
        pollInterval: process.env.NODE_ENV === "production" ? 10000 : undefined,
        skip: process.env.NODE_ENV === "development",
        refetch,
        startPolling,
        stopPolling,
    });

    const running = data?.builds[0]?.status === "active" || data?.builds[0]?.status === "pending";

    return (
        <DropdownMenuItem buttonIcon={running ? <SsgRunning color="primary" /> : <SsgStandby />} disableArrow>
            <Content>
                <List>
                    <ListItem dense={false}>
                        <Typography variant="body2">
                            <strong>
                                <FormattedMessage id="comet.header.buildStatus.staticSiteGeneration" defaultMessage="Static Site Generation" />
                            </strong>
                        </Typography>
                    </ListItem>
                    {error !== undefined && (
                        <ListItem dense={false}>
                            <Typography variant="body2" color="error">
                                <FormattedMessage id="comet.header.buildStatus.error" defaultMessage="Failed to fetch build status" />
                            </Typography>
                        </ListItem>
                    )}
                    {data && <BuildStatusPopperContent data={data} />}
                </List>
            </Content>
        </DropdownMenuItem>
    );
}

const Content = styled("div")`
    width: 300px;
    min-height: 40px;
    padding: 4px 0;
`;
