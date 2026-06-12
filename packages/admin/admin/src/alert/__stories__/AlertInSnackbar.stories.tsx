import { Snackbar } from "@mui/material";
import { useState } from "react";

import { Button } from "../../common/buttons/Button";
import { Alert } from "../Alert";

export default {
    title: "components/alert/AlertInSnackbar",
};

export const AlertInSnackbar = {
    render: () => {
        const [showSnackbar, setShowSnackbar] = useState(false);
        return (
            <>
                <Button
                    onClick={() => {
                        setShowSnackbar(true);
                    }}
                    variant="textDark"
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
    },

    name: "Alert in Snackbar",
};
