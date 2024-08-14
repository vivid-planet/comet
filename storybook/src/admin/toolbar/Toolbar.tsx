import {
    Stack,
    StackLink,
    StackPage,
    StackSwitch,
    Toolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarItem,
} from "@comet/admin";
import { ToolbarActionButton } from "@comet/admin/lib/common/toolbar/actions/ToolbarActionButton";
import { ArrowRight, Save } from "@comet/admin-icons";
import { Chip } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

function StackWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Stack topLevelTitle="Stack Root">
            <StackSwitch initialPage="root">
                <StackPage name="root">
                    {children}
                    <StackLink pageName="detail" payload="x">
                        Go to detail page
                    </StackLink>
                </StackPage>
                <StackPage name="detail" title=" Stack Detail">
                    {children}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

function Story() {
    return (
        <Toolbar>
            <ToolbarBackButton />
            <ToolbarAutomaticTitleItem />
            <ToolbarItem>
                <Chip label="Chip text" />
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarActions>
                <ToolbarActionButton startIcon={<ArrowRight />}>Secondary button</ToolbarActionButton>
                <ToolbarActionButton startIcon={<Save />} variant="contained">
                    Primary button
                </ToolbarActionButton>
            </ToolbarActions>
        </Toolbar>
    );
}

storiesOf("@comet/admin/toolbar", module)
    .addDecorator(storyRouterDecorator())
    .add("Toolbar", () => (
        <StackWrapper>
            <Story />
        </StackWrapper>
    ));
