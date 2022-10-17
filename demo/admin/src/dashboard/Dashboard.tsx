import { MainContent, messages, Stack } from "@comet/admin";
import { Domain } from "@comet/admin-icons";
import { ContentScopeIndicator } from "@comet/cms-admin";
import { useUser } from "@comet/react-app-auth";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ScopeIndicatorContent, ScopeIndicatorLabelBold } from "@src/common/ContentScopeIndicatorStyles";
import DateTime from "@src/dashboard/DateTime";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DashboardWidgetContainer } from "./components/DashboardWidgetContainer";
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

const Dashboard: React.FC = () => {
    const intl = useIntl();
    const user = useUser();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "cometDemo.dashboard", defaultMessage: "Dashboard" })}>
            <Header>
                <DateTime />
                <Greeting variant="h1">
                    {user ? (
                        <FormattedMessage
                            id="cometDemo.pages.dashboard.helloUser"
                            defaultMessage="Hallo {givenName}!"
                            values={{ givenName: user.given_name }}
                        />
                    ) : (
                        <FormattedMessage id="cometDemo.pages.dashboard.hello" defaultMessage="Hallo!" />
                    )}
                </Greeting>
            </Header>
            <MainContent>
                <ContentScopeIndicator global>
                    <ScopeIndicatorContent>
                        <Domain fontSize="small" />
                        <ScopeIndicatorLabelBold variant="body2">
                            <FormattedMessage {...messages.globalContentScope} />
                        </ScopeIndicatorLabelBold>
                    </ScopeIndicatorContent>
                </ContentScopeIndicator>
                <Grid container direction="row" spacing={4}>
                    <DashboardWidgetContainer
                        header={<FormattedMessage id="cometDemo.pages.dashboard.latestContentUpdates" defaultMessage="Latest Content Updates" />}
                    >
                        <LatestContentUpdates />
                    </DashboardWidgetContainer>
                    {process.env.NODE_ENV !== "development" && (
                        <DashboardWidgetContainer
                            header={<FormattedMessage id="cometDemo.pages.dashboard.latestBuilds" defaultMessage="Latest Builds" />}
                        >
                            <LatestBuilds />
                        </DashboardWidgetContainer>
                    )}
                </Grid>
            </MainContent>
        </Stack>
    );
};

export default Dashboard;
