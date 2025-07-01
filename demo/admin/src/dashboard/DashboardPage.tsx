import { MainContent, Stack, Toolbar } from "@comet/admin";
import {
    ContentScopeIndicator,
    DashboardHeader,
    LatestBuildsDashboardWidget,
    LatestWarningsDashboardWidget,
    useUserPermissionCheck,
} from "@comet/cms-admin";
import { Grid } from "@mui/material";
import { useIntl } from "react-intl";

import backgroundImage1x from "./dashboard-image@1x.jpg";
import backgroundImage2x from "./dashboard-image@2x.jpg";
import { LatestContentUpdates } from "./LatestContentUpdates";

export function DashboardPage() {
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
            <Toolbar scopeIndicator={<ContentScopeIndicator global />} />
            <MainContent>
                <Grid container direction="row" spacing={4}>
                    {isAllowed("pageTree") && (
                        <Grid
                            size={{
                                xs: 12,
                                lg: 6,
                            }}
                        >
                            <LatestContentUpdates />
                        </Grid>
                    )}
                    {import.meta.env.MODE !== "development" && <LatestBuildsDashboardWidget />}
                    {isAllowed("warnings") && <LatestWarningsDashboardWidget />}
                </Grid>
            </MainContent>
        </Stack>
    );
}
