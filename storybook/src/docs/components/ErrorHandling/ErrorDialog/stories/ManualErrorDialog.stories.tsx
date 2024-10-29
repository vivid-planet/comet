import { useErrorDialog } from "@comet/admin";
import { Button } from "@mui/material";
import * as React from "react";

import { apolloSwapiStoryDecorator } from "../../../../../apollo-story.decorator";
import { errorDialogStoryProviderDecorator } from "../error-dialog-provider.decorator";

export default {
    title: "stories/components/Error Handling/Error Dialog/Automatic Graphql Error Dialog",
    decorators: [apolloSwapiStoryDecorator(), errorDialogStoryProviderDecorator()],
};

export const ManualErrorDialog = () => {
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
};
