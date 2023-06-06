import { gql, useQuery } from "@apollo/client";
import { MainContent, Stack } from "@comet/admin";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ContentScopeIndicator } from "@src/common/ContentScopeIndicator";
import DateTime from "@src/dashboard/DateTime";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DashboardWidgetContainer } from "./components/DashboardWidgetContainer";
import { GQLDashboardCurrentUserQuery } from "./Dashboard.generated";
import backgroundImage1x from "./dashboard-image@1x.jpg";
import backgroundImage2x from "./dashboard-image@2x.jpg";
import { LatestBuilds } from "./LatestBuilds";
import { LatestContentUpdates } from "./LatestContentUpdates";

const Header = styled("div")`
    position: relative;
    height: 300px;
    background-image: url(${backgroundImage1x});
    background-size: cover;
    background-position: center;

    @media (min-device-pixel-ratio: 2) {
        background-image: url(${backgroundImage2x});
    }
`;

const Greeting = styled(Typography)`
    position: absolute;
    left: ${({ theme }) => theme.spacing(8)};
    bottom: ${({ theme }) => theme.spacing(8)};
    font-size: 55px;
    line-height: 64px;
    font-weight: 200;
    color: white;
`;

const currentUserQuery = gql`
    query DashboardCurrentUser {
        currentUser {
            name
        }
    }
`;

const Dashboard: React.FC = () => {
    const intl = useIntl();
    const { data } = useQuery<GQLDashboardCurrentUserQuery>(currentUserQuery);

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "dashboard", defaultMessage: "Dashboard" })}>
            <Header>
                <DateTime />
                <Greeting variant="h1">
                    {data ? (
                        <FormattedMessage
                            id="pages.dashboard.helloUser"
                            defaultMessage="Hallo {givenName}!"
                            values={{ givenName: data.currentUser.name }}
                        />
                    ) : (
                        <FormattedMessage id="pages.dashboard.hello" defaultMessage="Hallo!" />
                    )}
                </Greeting>
            </Header>
            <MainContent>
                <ContentScopeIndicator global />
                <Grid container direction="row" spacing={4}>
                    <DashboardWidgetContainer
                        header={<FormattedMessage id="pages.dashboard.latestContentUpdates" defaultMessage="Latest Content Updates" />}
                    >
                        <LatestContentUpdates />
                    </DashboardWidgetContainer>
                    {process.env.NODE_ENV !== "development" && (
                        <DashboardWidgetContainer header={<FormattedMessage id="pages.dashboard.latestBuilds" defaultMessage="Latest Builds" />}>
                            <LatestBuilds />
                        </DashboardWidgetContainer>
                    )}
                </Grid>
            </MainContent>
        </Stack>
    );
};

export default Dashboard;
