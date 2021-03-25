import { useErrorDialog } from "@comet/admin";
import { Button, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { errorDialogStoryProviderDecorator } from "../../error-dialog-provider.decorator";

const Story: React.FunctionComponent = () => {
    const errorDialog = useErrorDialog();
    return (
        <div>
            <Alert severity={"info"}>
                <Typography paragraph={true}>Error Dialog can be used to display an error in an dialog.</Typography>
                <Typography paragraph={true}>Try it out by simple pressing the Button below</Typography>
            </Alert>

            <Typography variant={"h5"}>Error Dialog</Typography>
            <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => {
                    errorDialog.showError({
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

storiesOf("@comet/admin/error-handling/error-dialog", module)
    .addDecorator(errorDialogStoryProviderDecorator())
    .add("ErrorDialogManually", () => <Story />);
