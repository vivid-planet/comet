import { WithStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

export type MainContentClassKey = "root" | "disablePaddingTop" | "disablePaddingBottom";

export interface MainContentProps {
    children?: React.ReactNode;
    disablePaddingTop?: boolean;
    disablePaddingBottom?: boolean;
}

const styles = ({ spacing }: Theme) => {
    return createStyles<MainContentClassKey, MainContentProps>({
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
    });
};

function Main({ children, disablePaddingTop, disablePaddingBottom, classes }: MainContentProps & WithStyles<typeof styles>) {
    const rootClasses: string[] = [classes.root];
    if (disablePaddingTop) rootClasses.push(classes.disablePaddingTop);
    if (disablePaddingBottom) rootClasses.push(classes.disablePaddingBottom);
    return <main className={rootClasses.join(" ")}>{children}</main>;
}

export const MainContent = withStyles(styles, { name: "CometAdminMainContent" })(Main);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminMainContent: MainContentClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminMainContent: MainContentProps;
    }
}
