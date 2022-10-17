import { Button, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { StartBuildsDialog } from "./StartBuildsDialog";

export const PublishButton: React.FunctionComponent = () => {
    const classes = useStyles();
    const [isStartBuildsDialogOpen, setIsStartBuildsDialogOpen] = React.useState(false);

    const handlePublishClick = () => {
        setIsStartBuildsDialogOpen(true);
    };

    return (
        <div className={classes.wrapper}>
            <Button variant="contained" color="primary" onClick={handlePublishClick} disabled={process.env.NODE_ENV === "development"} fullWidth>
                <FormattedMessage id="comet.pages.publisher.build" defaultMessage="Start builds" />
            </Button>
            <StartBuildsDialog
                open={isStartBuildsDialogOpen}
                onClose={() => {
                    setIsStartBuildsDialogOpen(false);
                }}
            />
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrapper: {
            position: "relative",
            width: "100%",
            margin: theme.spacing(1),
        },
    }),
);
