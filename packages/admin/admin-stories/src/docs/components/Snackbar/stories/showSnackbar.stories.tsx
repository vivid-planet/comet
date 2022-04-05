import { useSnackbarApi } from "@comet/admin";
import { Button, Snackbar } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { snackbarDecorator } from "../snackbar.decorator";

storiesOf("stories/components/Snackbar/Show Snackbar", module)
    .addDecorator(snackbarDecorator())
    .add("Show Snackbar", () => {
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
            return <Button onClick={showCustomSnackbar}>Show Snackbar</Button>;
        };
        return <Story />;
    });
