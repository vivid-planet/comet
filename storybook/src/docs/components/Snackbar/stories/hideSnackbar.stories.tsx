import { useSnackbarApi } from "@comet/admin";
import { Button, List, ListItem, Snackbar } from "@mui/material";
import * as React from "react";

import { snackbarDecorator } from "../snackbar.decorator";

export default {
    title: "stories/components/Snackbar/Hide Snackbar",
    decorators: [snackbarDecorator()],
};

export const HideSnackbar = () => {
    const Story = () => {
        const snackbarApi = useSnackbarApi();
        const showCustomSnackbar = () => {
            snackbarApi.showSnackbar(
                <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "left" }} autoHideDuration={5000} message="Minimal snackbar" />,
            );
        };
        return (
            <List>
                <ListItem>
                    <Button color="primary" onClick={showCustomSnackbar}>
                        Show Snackbar
                    </Button>
                </ListItem>
                <ListItem>
                    <Button color="secondary" onClick={snackbarApi.hideSnackbar}>
                        Hide Snackbar
                    </Button>
                </ListItem>
            </List>
        );
    };
    return <Story />;
};
