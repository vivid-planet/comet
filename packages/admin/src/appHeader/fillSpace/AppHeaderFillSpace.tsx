import { StyledComponentProps } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../../helpers/mergeClasses";
import { CometAdminAppHeaderFillSpaceClassKeys, useStyles } from "./AppHeaderFillSpace.styles";

export function AppHeaderFillSpace({ classes: passedClasses }: StyledComponentProps<CometAdminAppHeaderFillSpaceClassKeys>) {
    const classes = mergeClasses<CometAdminAppHeaderFillSpaceClassKeys>(useStyles(), passedClasses);
    return <div className={classes.root} />;
}
