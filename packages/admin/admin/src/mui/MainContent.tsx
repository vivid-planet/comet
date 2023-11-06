import { ComponentsOverrides, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

export type MainContentClassKey = "root" | "disablePaddingTop" | "disablePaddingBottom" | "disablePadding" | "fullHeight";

export interface MainContentProps {
    children?: React.ReactNode;
    disablePaddingTop?: boolean;
    disablePaddingBottom?: boolean;
    disablePadding?: boolean;
    fullHeight?: boolean;
}

const styles = ({ spacing }: Theme) => {
    return createStyles<MainContentClassKey, MainContentProps>({
        root: {
            position: "relative",
            zIndex: 5,
            padding: spacing(4),
        },
        fullHeight: {
            height: "calc(100vh - var(--comet-admin-main-content-top-position))",
        },
        disablePaddingTop: {
            paddingTop: 0,
        },
        disablePaddingBottom: {
            paddingBottom: 0,
        },
        disablePadding: {
            padding: 0,
        },
    });
};

function Main({
    children,
    fullHeight,
    disablePaddingTop,
    disablePaddingBottom,
    disablePadding,
    classes,
}: MainContentProps & WithStyles<typeof styles>) {
    const mainRef = React.useRef<HTMLElement>(null);
    const topPosition = fullHeight && mainRef.current ? mainRef.current.offsetTop : 0;

    const rootClasses: string[] = [classes.root];
    if (disablePaddingTop) rootClasses.push(classes.disablePaddingTop);
    if (disablePaddingBottom) rootClasses.push(classes.disablePaddingBottom);
    if (disablePadding) rootClasses.push(classes.disablePadding);
    if (fullHeight) rootClasses.push(classes.fullHeight);

    return (
        <main
            ref={mainRef}
            className={rootClasses.join(" ")}
            style={{ "--comet-admin-main-content-top-position": `${topPosition}px` } as React.CSSProperties}
        >
            {children}
        </main>
    );
}

export const MainContent = withStyles(styles, { name: "CometAdminMainContent" })(Main);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMainContent: MainContentClassKey;
    }

    interface ComponentsPropsList {
        CometAdminMainContent: Partial<MainContentProps>;
    }

    interface Components {
        CometAdminMainContent?: {
            defaultProps?: ComponentsPropsList["CometAdminMainContent"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMainContent"];
        };
    }
}
