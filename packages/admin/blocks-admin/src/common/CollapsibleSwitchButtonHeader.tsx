import { Switch, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { FunctionComponent } from "react";

interface CollapsibleSwitchButtonHeaderProps {
    checked: boolean;
    title?: React.ReactNode;
}

const useStyles = makeStyles({
    header: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});

export const CollapsibleSwitchButtonHeader: FunctionComponent<CollapsibleSwitchButtonHeaderProps> = ({ checked, title }) => {
    const classes = useStyles();
    return (
        <div className={classes.header}>
            <Typography>{title}</Typography>

            <Switch checked={checked} />
        </div>
    );
};
