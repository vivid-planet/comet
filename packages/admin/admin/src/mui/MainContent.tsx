import { ComponentsOverrides, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
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

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMainContent: MainContentClassKey;
    }

    interface ComponentsPropsList {
        CometAdminMainContent: MainContentProps;
    }

    interface Components {
        CometAdminMainContent?: {
            defaultProps?: ComponentsPropsList["CometAdminMainContent"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMainContent"];
        };
    }
}
