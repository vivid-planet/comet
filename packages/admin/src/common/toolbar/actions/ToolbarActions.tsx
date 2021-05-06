import * as React from "react";

import { useStyles } from "./ToolbarActions.styles";

const ToolbarActions: React.FunctionComponent = ({ children }) => {
    const classes = useStyles({});

    return <div className={classes.root}>{children}</div>;
};

export { ToolbarActions };
