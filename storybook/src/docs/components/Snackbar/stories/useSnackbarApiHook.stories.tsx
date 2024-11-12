import { useSnackbarApi } from "@comet/admin";
import { Button, List, ListItem, Snackbar } from "@mui/material";
import * as React from "react";

import { snackbarDecorator } from "../snackbar.decorator";

export default {
    title: "stories/components/Snackbar/useSnackbarApi()",
    decorators: [snackbarDecorator()],
};

export const UseSnackbarApi = {
    render: () => {
        const Story = () => {
            const snackbarApi = useSnackbarApi();
            const handleActionButtonClick = () => {
                window.alert("Action button clicked");
                snackbarApi.hideSnackbar();
            };
            const showCustomSnackbar = () => {
                snackbarApi.showSnackbar(
                    <Snackbar
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
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
    },

    name: "useSnackbarApi()",
};
