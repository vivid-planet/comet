import { MainContent, Stack } from "@comet/admin";
import { DashboardHeader, LatestBuildsDashboardWidget, useUserPermissionCheck } from "@comet/cms-admin";
import { Grid } from "@mui/material";
import { ContentScopeIndicator } from "@src/common/ContentScopeIndicator";
import * as React from "react";
import { useIntl } from "react-intl";

import backgroundImage1x from "./dashboard-image@1x.jpg";
import backgroundImage2x from "./dashboard-image@2x.jpg";
import { LatestContentUpdates } from "./LatestContentUpdates";

const Dashboard: React.FC = () => {
    const intl = useIntl();
    const isAllowed = useUserPermissionCheck();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "dashboard", defaultMessage: "Dashboard" })}>
            <DashboardHeader
                backgroundImageUrl={{
                    "1x": backgroundImage1x,
                    "2x": backgroundImage2x,
                }}
            />
            <MainContent>
                <ContentScopeIndicator global />
                <Grid container direction="row" spacing={4}>
                    {isAllowed("pageTree") && <LatestContentUpdates />}
                    {process.env.NODE_ENV !== "development" && <LatestBuildsDashboardWidget />}
                </Grid>
            </MainContent>
        </Stack>
    );
};

export default Dashboard;
