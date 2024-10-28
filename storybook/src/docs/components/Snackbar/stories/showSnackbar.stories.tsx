import { useSnackbarApi } from "@comet/admin";
import { Button, Snackbar } from "@mui/material";
import * as React from "react";

import { snackbarDecorator } from "../snackbar.decorator";

export default {
    title: "stories/components/Snackbar/Show Snackbar",
    decorators: [snackbarDecorator()],
};

export const ShowSnackbar = () => {
    const Story = () => {
        const snackbarApi = useSnackbarApi();
        const showCustomSnackbar = () => {
            snackbarApi.showSnackbar(
                <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "left" }} autoHideDuration={5000} message="Minimal snackbar" />,
            );
        };
        return <Button onClick={showCustomSnackbar}>Show Snackbar</Button>;
    };
    return <Story />;
};
