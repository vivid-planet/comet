import { Theme } from "@material-ui/core/styles";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

export interface MainContentProps {
    children: React.ReactNode;
}

export type CometAdminMainContentClassKeys = "root";

const styles = (theme: Theme) =>
    createStyles<CometAdminMainContentClassKeys, any>({
        root: {
            padding: theme.spacing(4),
        },
    });

const MainContent: React.FC<WithStyles<typeof styles> & CometAdminMainContentClassKeys> = ({ classes, children }) => {
    return <main className={classes.root}>{children}</main>;
};

const StyledCometAdminMainContent = withStyles(styles, { name: "CometAdminMainContent", withTheme: true })(MainContent);
export { StyledCometAdminMainContent as MainContent };
