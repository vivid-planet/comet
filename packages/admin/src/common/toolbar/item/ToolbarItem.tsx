import * as React from "react";

import { useStyles } from "./ToolbarItem.styles";

const ToolbarItem: React.FunctionComponent = ({ children }) => {
    const classes = useStyles();

    return <div className={classes.root}>{children}</div>;
};

export { ToolbarItem };
