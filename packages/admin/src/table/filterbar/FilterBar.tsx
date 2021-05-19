import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

export type CometAdminFilterBarClassKeys = "root" | "barWrapper";

const useStyles = makeStyles(
    (theme: Theme) => ({
        root: {
            "& [class*='CometAdminFormFieldContainer-root']": {
                marginBottom: 0,
            },
        },
        barWrapper: {
            flexWrap: "wrap",
            display: "flex",
        },
    }),
    { name: "CometAdminFilterBar" },
);

export const FilterBar: React.FunctionComponent = ({ children }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.barWrapper}>{children}</div>
        </div>
    );
};
