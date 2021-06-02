import { StyledComponentProps } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../../../helpers/mergeClasses";
import { CometAdminToolbarItemClassKeys, useStyles } from "./ToolbarItem.styles";

interface Props {
    children: React.ReactNode;
}

const ToolbarItem: React.FunctionComponent = ({ children, classes: passedClasses }: Props & StyledComponentProps<CometAdminToolbarItemClassKeys>) => {
    const classes = mergeClasses<CometAdminToolbarItemClassKeys>(useStyles(), passedClasses);

    return <div className={classes.root}>{children}</div>;
};

export { ToolbarItem };
