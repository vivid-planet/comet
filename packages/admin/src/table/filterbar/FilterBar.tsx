import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FieldState } from "final-form";
import * as React from "react";

export type CometAdminFilterBarClassKeys = "root" | "barWrapper" | "fieldBarWrapper";

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

export interface IFilterBarField {
    name: string;
    label: string;
    component: React.ComponentType<any>;
    dirtyFieldsBadge?: (fieldState?: FieldState<any>) => React.Component;
}

interface IFilterBarProps {}

export const FilterBar: React.FunctionComponent<IFilterBarProps> = ({ children }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.barWrapper}>{children}</div>
        </div>
    );
};
