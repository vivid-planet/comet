import * as React from "react";

import { useStyles } from "./FilterBar.styles";

export const FilterBar: React.FunctionComponent = ({ children }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.barWrapper}>{children}</div>
        </div>
    );
};
