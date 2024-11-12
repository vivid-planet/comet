import { Alert } from "@comet/admin";
import { Button, Snackbar } from "@mui/material";
import React from "react";

export default {
    title: "@comet/admin/alert/Alert",
};

export const AlertInSnackbar = () => {
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
};

AlertInSnackbar.storyName = "Alert in Snackbar";
