import { AppHeader, AppHeaderFillSpace, AppHeaderMenuButton, CometLogo, MainContent } from "@comet/admin";
import { ContentScopeControls, ContentScopeProvider, ContentScopeValues, useContentScope } from "@comet/cms-admin";
import { Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

storiesOf("@comet/cms-admin/Content Scope Provider", module)
    .addDecorator(storyRouterDecorator())
    .add("Optional dimensions", function () {
        type ContentScope = { organizationId?: string; channelId?: string };

        const values: ContentScopeValues<ContentScope> = [
            { organizationId: { value: "organization-1", label: "Organization 1" } },
            { channelId: { value: "channel-1", label: "Channel 1" } },
        ];

        function PrintContentScope() {
            const { scope } = useContentScope();

            return <>{JSON.stringify(scope)}</>;
        }

        return (
            <ContentScopeProvider
                values={values}
                defaultValue={{ organizationId: "organization-1" }}
                location={{
                    createPath: () => ["/organization/:organizationId", "/channel/:channelId"],
                    createUrl: (scope) => {
                        if (scope.organizationId) {
                            return `/organization/${scope.organizationId}`;
                        } else if (scope.channelId) {
                            return `/channel/${scope.channelId}`;
                        } else {
                            throw new Error("Invalid scope");
                        }
                    },
                }}
            >
                {({ match }) => {
                    return (
                        <>
                            <AppHeader position="relative" headerHeight={60}>
                                <AppHeaderMenuButton />
                                <CometLogo />
                                <AppHeaderFillSpace />
                                <ContentScopeControls />
                            </AppHeader>
                            <MainContent>
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
    });