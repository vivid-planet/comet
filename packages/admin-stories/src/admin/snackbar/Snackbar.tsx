import { SnackbarProvider, useSnackbarApi } from "@comet/admin/lib/snackbar/SnackbarProvider";
import { Button, List, ListItem } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";
import styled from "styled-components";

const InfoButton = styled(Button)`
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

const InfoSnackbar = () => {
    const snackbarApi = useSnackbarApi();

    const showInfoSnackbar = () => {
        snackbarApi.showSnackbar({
            // Use uuid in production
            key: counter++,
            message: "This is an info snackbar",
        });
    };

    return <InfoButton onClick={showInfoSnackbar}>Info Snackbar</InfoButton>;
};

const UndoSnackbar = () => {
    const snackbarApi = useSnackbarApi();

    const handleClick = (payload: { name: string; description: string }) => {
        console.log("Here you can do the undo operation");
        console.log("You can use the Payload: ", payload);
    };

    const showInfoSnackbar = () => {
        snackbarApi.showSnackbar({
            // Use uuid in production
            key: counter++,
            message: "This is a undo snackbar",
            onActionButtonClick: handleClick,
            actionButtonLabel: "Undo",
            payload: { name: "Payload", description: "This is a sample payload" },
        });
    };

    return <UndoButton onClick={showInfoSnackbar}>Undo Snackbar</UndoButton>;
};

function Story() {
    return (
        <SnackbarProvider>
            <List>
                <ListItem>
                    <InfoSnackbar />
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
