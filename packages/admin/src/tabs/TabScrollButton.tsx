import { ChevronLeft, ChevronRight } from "@comet/admin-icons";
import { ButtonBase, TabScrollButtonProps as MuiTabScrollButtonProps } from "@material-ui/core";
import { StyledComponentProps } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../helpers/mergeClasses";
import { CometAdminTabScrollButtonClassKeys, useStyles } from "./TabScrollButton.styles";

export interface TabScrollButtonProps extends MuiTabScrollButtonProps {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export function TabScrollButton({
    orientation,
    direction,
    disabled,
    onClick,
    classes: passedClasses,
}: TabScrollButtonProps & StyledComponentProps<CometAdminTabScrollButtonClassKeys>) {
    const classes = mergeClasses<CometAdminTabScrollButtonClassKeys>(useStyles(), passedClasses);

    const rootClasses: string[] = [classes.root];
    if (orientation === "vertical") rootClasses.push(classes.vertical);
    if (disabled) rootClasses.push(classes.disabled);

    return (
        <ButtonBase classes={{ root: rootClasses.join(" ") }} disabled={disabled} onClick={onClick}>
            <>{direction === "left" ? <ChevronLeft /> : <ChevronRight />}</>
        </ButtonBase>
    );
}
