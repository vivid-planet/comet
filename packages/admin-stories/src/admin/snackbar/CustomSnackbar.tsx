import { SnackbarProvider, useSnackbarApi } from "@comet/admin";
import { Button, List, ListItem, Snackbar } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

let counter = 0;

const CustomSnackbar = () => {
    const snackbarApi = useSnackbarApi();

    const handleActionButtonClick = () => {
        window.alert("Action button clicked");
        snackbarApi.hideSnackbar();
    };

    const showCustomSnackbar = () => {
        snackbarApi.showSnackbar(
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                // If no distinct key is set, the Snackbar may update in-place
                // meaning that the autoHideDuration is not reset (https://v4.mui.com/api/snackbar/)
                // Use uuid or object id in production
                key={counter++}
                autoHideDuration={5000}
                message="This is a completely customizable snackbar"
                action={
                    <Button color="secondary" size="small" onClick={handleActionButtonClick}>
                        Custom Button
                    </Button>
                }
            />,
        );
    };

    return (
        <List>
            <ListItem>
                <Button color={"primary"} onClick={showCustomSnackbar}>
                    Show Snackbar
                </Button>
            </ListItem>
            <ListItem>
                <Button color={"secondary"} onClick={snackbarApi.hideSnackbar}>
                    Hide Snackbar
                </Button>
            </ListItem>
        </List>
    );
};

function Story() {
    return (
        <SnackbarProvider>
            <CustomSnackbar />
        </SnackbarProvider>
    );
}

storiesOf("@comet/admin/snackbar", module).add("Custom Snackbar", () => <Story />);
