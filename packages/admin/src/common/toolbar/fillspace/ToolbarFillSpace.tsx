import * as React from "react";

import { useStyles } from "./ToolbarFillSpace.styles";

const ToolbarFillSpace: React.FunctionComponent = ({ children }) => {
    const classes = useStyles({});

    return <div className={classes.root}>{children}</div>;
};

export { ToolbarFillSpace };
