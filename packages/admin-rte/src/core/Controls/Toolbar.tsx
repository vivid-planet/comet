import { ComponentsOverrides, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { IControlProps } from "../types";
import getRteTheme from "../utils/getRteTheme";

interface IProps extends IControlProps {
    children: Array<(p: IControlProps) => JSX.Element | null>;
}

const Toolbar: React.FC<IProps & WithStyles<typeof styles>> = ({ children, classes, ...rest }) => {
    const childrenElements = children
        .filter((c) => {
            const Comp = c;
            return Comp(rest) !== null; // filter out unused control components
        })
        .map((c) => {
            const Comp = c;
            return React.createElement(Comp, rest);
        });

    return (
        <div className={classes.root}>
            {childrenElements.map((c, idx) => {
                return (
                    <div key={idx} className={classes.slot}>
                        {c}
                    </div>
                );
            })}
        </div>
    );
};

export type RteToolbarClassKey = "root" | "slot";

const styles = (theme: Theme) => {
    // TODO: Fix this
    // @ts-ignore
    const rteTheme = getRteTheme(theme.props?.CometAdminRte);

    return createStyles<RteToolbarClassKey, IProps>({
        root: {
            position: "sticky",
            top: 0,
            zIndex: 2,
            display: "flex",
            flexWrap: "wrap",
            borderTop: `1px solid ${rteTheme.colors.border}`,
            backgroundColor: rteTheme.colors.toolbarBackground,
            paddingLeft: 6,
            paddingRight: 6,
            overflow: "hidden",
        },
        slot: {
            position: "relative",
            flexShrink: 0,
            flexGrow: 0,
            height: 34,
            boxSizing: "border-box",
            paddingTop: 5,
            paddingBottom: 5,
            paddingRight: 6,
            marginRight: 5,
            "&::before, &::after": {
                content: "''",
                position: "absolute",
                backgroundColor: rteTheme.colors.border,
            },
            "&::before": {
                bottom: 0,
                height: 1,
                left: "-100vw",
                right: "-100vw",
            },
            "&::after": {
                top: 8,
                right: 0,
                bottom: 8,
                width: 1,
            },
            "&:last-child": {
                marginRight: 0,
            },
            "&:last-child::after": {
                display: "none",
            },
        },
    });
};

export default withStyles(styles, { name: "CometAdminRteToolbar" })(Toolbar);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminRteToolbar: RteToolbarClassKey;
    }

    interface Components {
        CometAdminRteToolbar?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminRteToolbar"];
        };
    }
}
