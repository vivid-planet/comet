import { AppHeader, AppHeaderMenuButton, CometLogo, FillSpace, MainContent } from "@comet/admin";
import { ContentScopeControls, ContentScopeIndicator, ContentScopeProvider, ContentScopeValues, useContentScope } from "@comet/cms-admin";
import { Typography } from "@mui/material";

import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/cms-admin/Content Scope Provider",
    decorators: [storyRouterDecorator()],
};

export const OptionalDimensions = function () {
    type ContentScope = { organizationId?: string; channelId?: string };

    const values: ContentScopeValues<ContentScope> = [
        { organizationId: { value: "organization-1", label: "Organization 1" } },
        { organizationId: { value: "organization-2", label: "Organization 2" } },
        { channelId: { value: "channel-1", label: "Channel 1" } },
        { channelId: { value: "channel-2", label: "Channel 2" } },
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
                                This is a development story to test optional scope dimensions in the content scope provider. Try changing the scope in
                                the content scope select.
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
};

OptionalDimensions.storyName = "Optional dimensions";
