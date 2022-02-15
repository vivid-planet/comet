import { Typography, TypographyTypeMap } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { ToolbarItem } from "../item/ToolbarItem";

export type ToolbarTitleItemClassKey = "root" | "typography";

export interface ToolbarTitleItemProps {
    typographyProps?: TypographyTypeMap["props"];
}

const styles = () => {
    return createStyles<ToolbarTitleItemClassKey, React.PropsWithChildren<ToolbarTitleItemProps>>({
        root: {},
        typography: {},
    });
};

function TitleItem({
    children,
    typographyProps = {},
    classes,
}: React.PropsWithChildren<ToolbarTitleItemProps> & WithStyles<typeof styles>): React.ReactElement {
    return (
        <ToolbarItem classes={{ root: classes.root }}>
            <Typography variant="h4" classes={{ root: classes.typography }} {...typographyProps}>
                {children}
            </Typography>
        </ToolbarItem>
    );
}

export const ToolbarTitleItem = withStyles(styles, { name: "CometAdminToolbarTitleItem" })(TitleItem);

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbarTitleItem: ToolbarTitleItemClassKey;
    }
}

declare module "@mui/material/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbarTitleItem: ToolbarTitleItemProps;
    }
}
