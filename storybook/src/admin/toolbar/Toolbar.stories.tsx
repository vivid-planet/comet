import {
    Button,
    FillSpace,
    Stack,
    StackLink,
    StackPage,
    StackSwitch,
    Toolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarBackButton,
    ToolbarItem,
} from "@comet/admin";
import { ArrowRight, Save } from "@comet/admin-icons";
import { Chip } from "@mui/material";
import { ReactNode } from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

function StackWrapper({ children }: { children: ReactNode }) {
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
            <FillSpace />
            <ToolbarActions>
                <Button responsive startIcon={<ArrowRight />}>
                    Secondary button
                </Button>
                <Button responsive startIcon={<Save />} variant="contained">
                    Primary button
                </Button>
            </ToolbarActions>
        </Toolbar>
    );
}

export default {
    title: "@comet/admin/toolbar",
    decorators: [storyRouterDecorator()],
};

export const _Toolbar = () => (
    <StackWrapper>
        <Story />
    </StackWrapper>
);
