import { SnackbarProvider, useSnackbarApi } from "@comet/admin";
import { useUndoSnackbar } from "@comet/admin";
import { Button, List, ListItem, Slide } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
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
    const snackbarApi = useSnackbarApi();

    const showCustomSnackbar = () => {
        snackbarApi.showSnackbar({
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            // Use uuid or object id in production
            key: counter++,
            autoHideDuration: 5000,
            message: "This is a completely customizable snackbar",
            action: (
                <Button color="secondary" size="small" onClick={handleActionButtonClick}>
                    Custom Button
                </Button>
            ),
            TransitionComponent: (props: TransitionProps) => <Slide {...props} direction="up" />,
        });
    };

    const handleActionButtonClick = () => {
        console.log("Do stuff here");
        snackbarApi.hideSnackbar();
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
            // Use uuid or object id in production
            key: counter++,
            message: "This is an undo snackbar",
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
