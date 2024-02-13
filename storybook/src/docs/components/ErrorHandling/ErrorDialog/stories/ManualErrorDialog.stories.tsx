import { useErrorDialog } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloSwapiStoryDecorator } from "../../../../../apollo-story.decorator";
import { errorDialogStoryProviderDecorator } from "../error-dialog-provider.decorator";

storiesOf("stories/components/Error Handling/Error Dialog/Automatic Graphql Error Dialog", module)
    .addDecorator(apolloSwapiStoryDecorator())
    .addDecorator(errorDialogStoryProviderDecorator())
    .add("Manual Error Dialog", () => {
        const Story = () => {
            const errorDialog = useErrorDialog();
            return (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            errorDialog?.showError({
                                title: "Error",
                                userMessage: "You can close the error dialog by pressing ok",
                                error: "This is an error detail information e.g. stack trace, which is only shown in development mode",
                            });
                        }}
                    >
                        Show Error Dialog
                    </Button>
                </div>
            );
        };
        return <Story />;
    });
