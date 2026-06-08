import { AppHeader, AppHeaderMenuButton, CometLogo, FillSpace, MainContent } from "@comet/admin";
import { Typography } from "@mui/material";
import type { Meta } from "@storybook/react-vite";

import { ContentScopeIndicator } from "../ContentScopeIndicator";
import { ContentScopeControls } from "../Controls";
import { ContentScopeProvider, type ContentScopeValues, useContentScope } from "../Provider";

const config: Meta<typeof ContentScopeProvider> = {
    component: ContentScopeProvider,
    title: "contentScope/ContentScopeProvider",
};

export default config;

export const OptionalDimensions = {
    render: () => {
        const values: ContentScopeValues = [
            { scope: { organizationId: "organization-1" }, label: { organizationId: "Organization 1" } },
            { scope: { organizationId: "organization-2" }, label: { organizationId: "Organization 2" } },
            { scope: { channelId: "channel-1" }, label: { channelId: "Channel 1" } },
            { scope: { channelId: "channel-2" }, label: { channelId: "Channel 2" } },
        ];

        function PrintContentScope() {
            const { scope } = useContentScope();

            return <>{JSON.stringify(scope)}</>;
        }

        return (
            <ContentScopeProvider values={values} defaultValue={{ organizationId: "organization-1" }}>
                {({ match }) => {
                    return (
                        <>
                            <AppHeader position="relative" headerHeight={60}>
                                <AppHeaderMenuButton />
                                <CometLogo />
                                <FillSpace />
                                <ContentScopeControls />
                            </AppHeader>
                            <MainContent>
                                <ContentScopeIndicator />
                                <Typography gutterBottom>
                                    This is a development story to test optional scope dimensions in the content scope provider. Try changing the
                                    scope in the content scope select.
                                </Typography>
                                <Typography>
                                    Path: <strong>{match.path}</strong>
                                </Typography>
                                <Typography>
                                    URL: <strong>{match.url}</strong>
                                </Typography>
                                <Typography>
                                    Scope:{" "}
                                    <strong>
                                        <PrintContentScope />
                                    </strong>
                                </Typography>
                            </MainContent>
                        </>
                    );
                }}
            </ContentScopeProvider>
        );
    },
    name: "Optional dimensions",
};
