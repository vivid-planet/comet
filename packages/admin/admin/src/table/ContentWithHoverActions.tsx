import { ComponentsOverrides, Grow, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

export type ContentWithHoverActionsProps = React.PropsWithChildren<{
    actions?: React.ReactNode;
}>;

const ContentWithHoverActions = ({ classes, actions, children }: ContentWithHoverActionsProps & WithStyles<typeof styles>): React.ReactElement => {
    const [isHovering, setIsHovering] = React.useState<boolean>(false);

    return (
        <div className={classes.root} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <div className={classes.hoverAreaExpansion} />
            <Grow in={Boolean(actions) && isHovering}>
                <div className={classes.actions}>{actions}</div>
            </Grow>
            <div className={classes.children}>{children}</div>
        </div>
    );
};

export type ContentWithHoverActionsClassKey = "root" | "hoverAreaExpansion" | "actions" | "children";

const styles = ({ spacing }: Theme) => {
    return createStyles<ContentWithHoverActionsClassKey, ContentWithHoverActionsProps>({
        root: {},
        hoverAreaExpansion: {
            // This element expands the root's hover area to include the parent's full size, including padding.
            // For example, when used inside a MuiTableCell, the whole cell can be hovered instead of only its text content.
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
        },
        actions: {
            position: "absolute",
            zIndex: 2,
            top: 0,
            bottom: 0,
            right: 0,
            paddingLeft: spacing(2),
            paddingRight: spacing(2),
            backgroundColor: "rgba(255, 255 ,255, 0.9)",
            display: "flex",
            alignItems: "center",
        },
        children: {
            position: "relative",
            zIndex: 1,
        },
    });
};

const ContentWithHoverActionsPropsWithStyles = withStyles(styles, { name: "CometAdminContentWithHoverActions" })(ContentWithHoverActions);

export { ContentWithHoverActionsPropsWithStyles as ContentWithHoverActions };

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminContentWithHoverActions: ContentWithHoverActionsClassKey;
    }

    interface ComponentsPropsList {
        CometAdminContentWithHoverActions: ContentWithHoverActionsProps;
    }

    interface Components {
        CometAdminContentWithHoverActions?: {
            defaultProps?: ComponentsPropsList["CometAdminContentWithHoverActions"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminContentWithHoverActions"];
        };
    }
}
