import { MainContent, Stack } from "@comet/admin";
import { Domain } from "@comet/admin-icons";
import { ContentScopeIndicator } from "@comet/admin-cms";
import { Grid, Typography } from "@material-ui/core";
import { ScopeIndicatorContent, ScopeIndicatorLabelBold } from "@src/common/ContentScopeIndicatorStyles";
import DateTime from "@src/dashboard/DateTime";
import { useUser } from "@vivid/react-oidc-client";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";

import { DashboardWidgetContainer } from "./components/DashboardWidgetContainer";
import backgroundImage1x from "./dashboard-image@1x.jpg";
import backgroundImage2x from "./dashboard-image@2x.jpg";
import { LatestBuilds } from "./LatestBuilds";
import { LatestContentUpdates } from "./LatestContentUpdates";

const Header = styled.div`
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
    left: ${({ theme }) => theme.spacing(8)}px;
    bottom: ${({ theme }) => theme.spacing(8)}px;
    font-size: 55px;
    line-height: 64px;
    font-weight: 200;
    color: white;
`;

const Dashboard: React.FC = () => {
    const intl = useIntl();
    const user = useUser();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "comet.dashboard", defaultMessage: "Dashboard" })}>
            <Header>
                <DateTime />
                <Greeting variant={"h1"}>
                    {user ? (
                        <FormattedMessage
                            id="comet.pages.dashboard.helloUser"
                            defaultMessage="Hallo {givenName}!"
                            values={{ givenName: user.given_name }}
                        />
                    ) : (
                        <FormattedMessage id="comet.pages.dashboard.hello" defaultMessage="Hallo!" />
                    )}
                </Greeting>
            </Header>
            <MainContent>
                <ContentScopeIndicator global>
                    <ScopeIndicatorContent>
                        <Domain fontSize="small" />
                        <ScopeIndicatorLabelBold variant="body2">
                            <FormattedMessage id="comet.generic.globalContentScope" defaultMessage="Global Content" />
                        </ScopeIndicatorLabelBold>
                    </ScopeIndicatorContent>
                </ContentScopeIndicator>
                <Grid container direction="row" spacing={4}>
                    <DashboardWidgetContainer
                        header={<FormattedMessage id="comet.pages.dashboard.latestContentUpdates" defaultMessage="Latest Content Updates" />}
                    >
                        <LatestContentUpdates />
                    </DashboardWidgetContainer>
                    {process.env.NODE_ENV !== "development" && (
                        <DashboardWidgetContainer
                            header={<FormattedMessage id="comet.pages.dashboard.latestBuilds" defaultMessage="Latest Builds" />}
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
