import { useSnackbarApi } from "@comet/admin";
import { Button, List, ListItem, Snackbar } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { snackbarDecorator } from "../snackbar.decorator";

storiesOf("stories/components/Snackbar/Hide Snackbar", module)
    .addDecorator(snackbarDecorator())
    .add("Hide Snackbar", () => {
        const Story = () => {
            const snackbarApi = useSnackbarApi();
            const showCustomSnackbar = () => {
                snackbarApi.showSnackbar(
                    <Snackbar
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        // Use uuid or object id in production
                        key={Math.random()}
                        autoHideDuration={5000}
                        message={"Minimal snackbar"}
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
        return <Story />;
    });
