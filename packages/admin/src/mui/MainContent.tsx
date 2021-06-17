import { makeStyles } from "@material-ui/core";
import { StyledComponentProps, Theme } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../helpers/mergeClasses";

export interface MainContentProps {
    children?: React.ReactNode;
    disablePaddingTop?: boolean;
    disablePaddingBottom?: boolean;
}

export function MainContent({
    children,
    disablePaddingTop,
    disablePaddingBottom,
    classes: passedClasses,
}: MainContentProps & StyledComponentProps<CometAdminMainContentClassKeys>) {
    const classes = mergeClasses<CometAdminMainContentClassKeys>(useStyles(), passedClasses);
    const rootClasses: string[] = [classes.root];
    if (disablePaddingTop) rootClasses.push(classes.disablePaddingTop);
    if (disablePaddingBottom) rootClasses.push(classes.disablePaddingBottom);
    return <main className={rootClasses.join(" ")}>{children}</main>;
}

export type CometAdminMainContentClassKeys = "root" | "disablePaddingTop" | "disablePaddingBottom";

export const useStyles = makeStyles<Theme, {}, CometAdminMainContentClassKeys>(
    ({ spacing }) => ({
        root: {
            position: "relative",
            zIndex: 5,
            padding: spacing(4),
        },
        disablePaddingTop: {
            paddingTop: 0,
        },
        disablePaddingBottom: {
            paddingBottom: 0,
        },
    }),
    { name: "CometAdminMainContent" },
);

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminMainContent: MainContentProps;
    }
}

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminMainContent: CometAdminMainContentClassKeys;
    }
}
