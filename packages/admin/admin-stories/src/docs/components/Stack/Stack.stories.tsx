import {
    Stack,
    StackBackButton,
    StackBreadcrumbs,
    StackLink,
    StackPage,
    StackPageTitle,
    StackSwitch,
    Toolbar,
    ToolbarBackButton,
    ToolbarBreadcrumbs,
    useStackSwitch,
    useStackSwitchApi,
} from "@comet/admin";
import { Button, Link } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../../apollo-story.decorator";
import { storyRouterDecorator } from "../../../story-router.decorator";

storiesOf("stories/components/Stack", module)
    .addDecorator(apolloStoryDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Basic", () => {
        return (
            <Stack topLevelTitle="Example Stack">
                <StackSwitch>
                    <StackPage name="page1">
                        <Page1 />
                    </StackPage>
                    <StackPage name="page2">
                        <Page2 />
                    </StackPage>
                </StackSwitch>
            </Stack>
        );

        function Page1() {
            const switchApi = useStackSwitchApi();
            return (
                <>
                    <h3>Page 1</h3>
                    <button
                        onClick={(e) => {
                            switchApi.activatePage("page2", "test");
                        }}
                    >
                        activate page2
                    </button>
                </>
            );
        }

        function Page2() {
            const switchApi = useStackSwitchApi();
            return (
                <>
                    <h3>Page 2</h3>
                    <button
                        onClick={(e) => {
                            switchApi.activatePage("page1", "");
                        }}
                    >
                        activate page1
                    </button>
                </>
            );
        }
    })
    .add("Payload", () => {
        return (
            <Stack topLevelTitle="Example Stack">
                <StackSwitch>
                    <StackPage name="page1">
                        <Foo payload="test1" />
                        <Foo payload="test2" />
                    </StackPage>
                    <StackPage name="page2">{(payload) => <div>Passed payload: {payload}</div>}</StackPage>
                </StackSwitch>
            </Stack>
        );

        function Foo({ payload }: { payload: string }) {
            const switchApi = useStackSwitchApi();
            return (
                <>
                    <button
                        onClick={(e) => {
                            switchApi.activatePage("page2", payload);
                        }}
                    >
                        activate page2 with payload {payload}
                    </button>
                </>
            );
        }
    })
    .add("Nested", () => {
        return (
            <Stack topLevelTitle="Example Stack">
                <StackBackButton />
                <StackBreadcrumbs />
                <StackSwitch>
                    <StackPage name="page1">
                        <Page1 />
                    </StackPage>
                    <StackPage name="page2">
                        <Page2 />
                    </StackPage>
                </StackSwitch>
            </Stack>
        );

        function Page1() {
            const switchApi = useStackSwitchApi();
            return (
                <>
                    <h3>Page 1</h3>
                    <button
                        onClick={(e) => {
                            switchApi.activatePage("page2", "test");
                        }}
                    >
                        activate page2
                    </button>
                </>
            );
        }

        function Page2() {
            return (
                <>
                    <StackSwitch>
                        <StackPage name="page2-1">
                            <Page2_1 />
                        </StackPage>
                        <StackPage name="page2-2">page 2-2</StackPage>
                    </StackSwitch>
                </>
            );
        }

        function Page2_1() {
            const switchApi = useStackSwitchApi();
            return (
                <>
                    <h3>Page 2-1</h3>
                    <button
                        onClick={(e) => {
                            switchApi.activatePage("page2-2", "test");
                        }}
                    >
                        activate page2-2
                    </button>
                </>
            );
        }
    })
    .add("BreadrumbsToolbar", () => {
        return (
            <Stack topLevelTitle="Example Stack">
                <Toolbar>
                    <ToolbarBackButton />
                    <ToolbarBreadcrumbs />
                </Toolbar>
                <StackSwitch>
                    <StackPage name="page1">
                        <Page1 />
                    </StackPage>
                    <StackPage name="page2">
                        <Page2 />
                    </StackPage>
                </StackSwitch>
            </Stack>
        );

        function Page1() {
            const switchApi = useStackSwitchApi();
            return (
                <>
                    <h3>Page 1</h3>
                    <button
                        onClick={(e) => {
                            switchApi.activatePage("page2", "test");
                        }}
                    >
                        activate page2
                    </button>
                </>
            );
        }

        function Page2() {
            return (
                <>
                    <StackSwitch>
                        <StackPage name="page2-1">
                            <Page2_1 />
                        </StackPage>
                        <StackPage name="page2-2">page 2-2</StackPage>
                    </StackSwitch>
                </>
            );
        }

        function Page2_1() {
            const switchApi = useStackSwitchApi();
            return (
                <>
                    <h3>Page 2-1</h3>
                    <button
                        onClick={(e) => {
                            switchApi.activatePage("page2-2", "test");
                        }}
                    >
                        activate page2-2
                    </button>
                </>
            );
        }
    })
    .add("DynamicTitle", () => {
        return (
            <Stack topLevelTitle="Example Stack">
                <Toolbar>
                    <ToolbarBackButton />
                    <ToolbarBreadcrumbs />
                </Toolbar>
                <StackSwitch>
                    <StackPage name="page1">
                        <Foo payload="test1" />
                        <Foo payload="test2" />
                    </StackPage>
                    <StackPage name="page2">
                        {(payload) => (
                            <StackPageTitle title={payload}>
                                <div>Passed payload: {payload}</div>
                            </StackPageTitle>
                        )}
                    </StackPage>
                </StackSwitch>
            </Stack>
        );

        function Foo({ payload }: { payload: string }) {
            const switchApi = useStackSwitchApi();
            return (
                <>
                    <button
                        onClick={(e) => {
                            switchApi.activatePage("page2", payload);
                        }}
                    >
                        activate page2 with payload {payload}
                    </button>
                </>
            );
        }
    })
    .add("useStackSwitch", () => {
        const [StackSwitch, switchApi] = useStackSwitch();
        return (
            <div>
                <p>
                    <button
                        onClick={() => {
                            switchApi.activatePage("page2", "foo");
                        }}
                    >
                        page2
                    </button>
                </p>
                <p>
                    <StackLink pageName="page2" payload="foo" switchApi={switchApi}>
                        link to page2
                    </StackLink>
                </p>
                <Stack topLevelTitle="Stack">
                    <StackBreadcrumbs />
                    <StackSwitch>
                        <StackPage name="page1">
                            <div>page1</div>
                        </StackPage>
                        <StackPage name="page2">
                            <div>page2</div>
                        </StackPage>
                    </StackSwitch>
                </Stack>
            </div>
        );
    })
    .add("StackLink MuiLink", () => {
        return (
            <Stack topLevelTitle="Example Stack with StackLinks">
                <StackSwitch>
                    <StackPage name="page1">
                        <h3>Page 1</h3>
                        <Link component={StackLink} pageName="page2" payload="test">
                            StackLink-based MuiLink to page2
                        </Link>
                    </StackPage>
                    <StackPage name="page2">
                        <h3>Page 2</h3>
                        <Link component={StackLink} pageName="page1" payload="test">
                            StackLink-based MuiLink to page1
                        </Link>
                    </StackPage>
                </StackSwitch>
            </Stack>
        );
    })
    .add("StackLink Button", () => {
        return (
            <Stack topLevelTitle="Example Stack with StackLinks">
                <StackSwitch>
                    <StackPage name="page1">
                        <h3>Page 1</h3>
                        <Button component={StackLink} pageName="page2" payload="test">
                            StackLink-based Button to page2
                        </Button>
                    </StackPage>
                    <StackPage name="page2">
                        <h3>Page 2</h3>
                        <Button component={StackLink} pageName="page1" payload="test">
                            StackLink-based Button to page1
                        </Button>
                    </StackPage>
                </StackSwitch>
            </Stack>
        );
    });
