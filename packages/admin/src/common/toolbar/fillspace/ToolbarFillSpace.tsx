import { StyledComponentProps } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../../../helpers/mergeClasses";
import { CometAdminToolbarFillSpaceClassKeys, useStyles } from "./ToolbarFillSpace.styles";

interface Props {
    children: React.ReactNode;
}

const ToolbarFillSpace: React.FunctionComponent = ({
    children,
    classes: passedClasses,
}: Props & StyledComponentProps<CometAdminToolbarFillSpaceClassKeys>) => {
    const classes = mergeClasses<CometAdminToolbarFillSpaceClassKeys>(useStyles(), passedClasses);

    return <div className={classes.root}>{children}</div>;
};

export { ToolbarFillSpace };
