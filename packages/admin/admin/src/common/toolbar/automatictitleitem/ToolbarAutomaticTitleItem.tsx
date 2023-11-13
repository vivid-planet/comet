import { ComponentsOverrides, Theme, Typography, TypographyTypeMap } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";

import { useStackApi } from "../../../stack/Api";
import { ToolbarItem } from "../item/ToolbarItem";

export interface ToolbarAutomaticTitleItemProps {
    typographyProps?: TypographyTypeMap["props"];
}

export type ToolbarAutomaticTitleItemClassKey = "root" | "typography";

const styles = () => {
    return createStyles<ToolbarAutomaticTitleItemClassKey, ToolbarAutomaticTitleItemProps>({
        root: {},
        typography: {},
    });
};

function AutomaticTitleItem({ typographyProps = {}, classes }: ToolbarAutomaticTitleItemProps & WithStyles<typeof styles>): React.ReactElement {
    const stackApi = useStackApi();

    const { classes: typographyClasses = {}, ...restTypographyProps } = typographyProps;
    typographyClasses.root = clsx(typographyClasses.root, classes.typography);

    return (
        <ToolbarItem classes={{ root: classes.root }}>
            <Typography variant="h4" classes={typographyClasses} {...restTypographyProps}>
                {stackApi?.breadCrumbs != null && stackApi.breadCrumbs.length > 0 && stackApi.breadCrumbs[stackApi?.breadCrumbs.length - 1].title}
            </Typography>
        </ToolbarItem>
    );
}

export const ToolbarAutomaticTitleItem = withStyles(styles, { name: "CometAdminToolbarAutomaticTitleItem" })(AutomaticTitleItem);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbarAutomaticTitleItem: ToolbarAutomaticTitleItemClassKey;
    }
    interface ComponentsPropsList {
        CometAdminToolbarAutomaticTitleItem: Partial<ToolbarAutomaticTitleItemProps>;
    }

    interface Components {
        CometAdminToolbarAutomaticTitleItem?: {
            defaultProps?: ComponentsPropsList["CometAdminToolbarAutomaticTitleItem"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarAutomaticTitleItem"];
        };
    }
}
