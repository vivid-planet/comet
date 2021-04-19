import { SnackbarProvider, useSnackbarApi } from "@comet/admin/lib/snackbar/SnackbarProvider";
import { useUndoSnackbar } from "@comet/admin/lib/snackbar/UndoSnackbar";
import { Button, List, ListItem, Slide, Snackbar, SnackbarCloseReason } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import StoryRouter from "storybook-react-router";
import styled from "styled-components";

const CustomSnackbarButton = styled(Button)`
    && {
        background-color: blue;
        color: white;
    }

    &&:hover {
        opacity: 0.7;
        background-color: blue;
    }
`;

const UndoButton = styled(Button)`
    && {
        background-color: darkred;
        color: white;

        &&:hover {
            opacity: 0.7;
            background-color: darkred;
        }
    }
`;

let counter = 0;

const CustomSnackbar = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const snackbarApi = useSnackbarApi();

    const handleClose = (event: React.SyntheticEvent, reason: SnackbarCloseReason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const handleActionButtonClick = () => {
        setOpen(false);
        console.log("Do stuff here");
    };

    const showCustomSnackbar = () => {
        setOpen(true);

        snackbarApi.showSnackbar(
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                open={open}
                key={counter++}
                autoHideDuration={5000}
                onClose={handleClose}
                message={"This is a completely customizable snackbar"}
                action={
                    <Button color="secondary" size="small" onClick={handleActionButtonClick}>
                        <FormattedMessage id="cometAdmin.generic.ok" defaultMessage="OK" />
                    </Button>
                }
                TransitionComponent={(props: TransitionProps) => <Slide {...props} direction="down" />}
            />,
        );
    };

    return <CustomSnackbarButton onClick={showCustomSnackbar}>Custom Snackbar</CustomSnackbarButton>;
};

const UndoSnackbar = () => {
    const snackbarApi = useUndoSnackbar();

    const handleClick = (payload: { name: string; description: string }) => {
        console.log("Here you can do the undo operation");
        console.log("You can use the Payload: ", payload);
    };

    const showUndoSnackbar = () => {
        snackbarApi.showUndoSnackbar({
            // Use uuid in production
            key: counter++,
            message: "This is a undo snackbar",
            onActionButtonClick: handleClick,
            payload: { name: "Payload", description: "This is a sample payload" },
        });
    };

    return <UndoButton onClick={showUndoSnackbar}>Undo Snackbar</UndoButton>;
};

function Story() {
    return (
        <SnackbarProvider>
            <List>
                <ListItem>
                    <CustomSnackbar />
                </ListItem>

                <ListItem>
                    <UndoSnackbar />
                </ListItem>
            </List>
        </SnackbarProvider>
    );
}

storiesOf("@comet/admin/snackbar", module)
    .addDecorator(StoryRouter())
    .add("Snackbar", () => <Story />);
