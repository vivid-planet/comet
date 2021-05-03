import * as React from "react";

import { useToolbarItemStyles } from "./ToolbarItem.styles";

const ToolbarItem: React.FunctionComponent = ({ children }) => {
    const classes = useToolbarItemStyles();

    return <div className={classes.root}>{children}</div>;
};

export { ToolbarItem };
