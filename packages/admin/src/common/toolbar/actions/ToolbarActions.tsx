import { StyledComponentProps } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../../../helpers/mergeClasses";
import { CometAdminToolbarActionsClassKeys, useStyles } from "./ToolbarActions.styles";

interface Props {
    children: React.ReactNode;
}

const ToolbarActions: React.FunctionComponent = ({
    children,
    classes: passedClasses,
}: Props & StyledComponentProps<CometAdminToolbarActionsClassKeys>) => {
    const classes = mergeClasses<CometAdminToolbarActionsClassKeys>(useStyles(), passedClasses);

    return <div className={classes.root}>{children}</div>;
};

export { ToolbarActions };
