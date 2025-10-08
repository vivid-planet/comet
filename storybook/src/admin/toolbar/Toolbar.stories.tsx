import {
    Button,
    FillSpace,
    HelpDialogButton,
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
import { ContentScopeIndicator } from "@comet/cms-admin";
import { Chip } from "@mui/material";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

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
                <Button responsive startIcon={<ArrowRight />} variant="outlined">
                    Secondary button
                </Button>
                <Button responsive startIcon={<Save />}>
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

export const ToolbarWithHelp = () => {
    return (
        <Toolbar
            scopeIndicator={<ContentScopeIndicator global />}
            topBarActions={
                <HelpDialogButton
                    dialogTitle={<FormattedMessage id="story.toolbar.helpDialog.title" defaultMessage="Help" />}
                    dialogDescription={
                        <div>
                            <div
                                style={{
                                    backgroundColor: "teal",
                                    width: "200px",
                                    height: "200px",
                                    float: "right",
                                    marginLeft: 16,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    display: "flex",
                                }}
                            >
                                Image Placeholder
                            </div>
                            <p>This is some help text. You can put whatever you want in here, for example an image to illustrate your help.</p>
                        </div>
                    }
                />
            }
        >
            <ToolbarItem>Some title</ToolbarItem>
        </Toolbar>
    );
};
