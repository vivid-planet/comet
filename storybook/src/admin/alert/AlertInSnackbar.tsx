import { Alert } from "@comet/admin";
import { Button, Snackbar } from "@mui/material";
import { storiesOf } from "@storybook/react";
import React from "react";

storiesOf("@comet/admin/alert/Alert", module).add("Alert in Snackbar", () => {
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    return (
        <>
            <Button
                onClick={() => {
                    setShowSnackbar(true);
                }}
            >
                Show snackbar
            </Button>
            <Snackbar open={showSnackbar} onClose={() => setShowSnackbar(false)} autoHideDuration={2000}>
                <Alert severity="success" onClose={() => setShowSnackbar(false)}>
                    Notification Text
                </Alert>
            </Snackbar>
        </>
    );
});
