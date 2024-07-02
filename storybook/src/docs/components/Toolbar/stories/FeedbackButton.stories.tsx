import { FeedbackButton, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Assets } from "@comet/admin-icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Feedback Button", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Feedback", () => {
        return (
            <Toolbar>
                <ToolbarTitleItem>Feedback Button</ToolbarTitleItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <FeedbackButton
                        color="primary"
                        variant="contained"
                        onClick={async () => new Promise((resolve) => setTimeout(resolve, 2000))}
                        startIcon={<Assets />}
                        tooltipSuccessMessage="Saving was successful"
                        tooltipErrorMessage="Error while saving"
                    >
                        Feedback
                    </FeedbackButton>
                </ToolbarActions>
            </Toolbar>
        );
    });
