import { ComponentsOverrides, Theme, Typography, TypographyProps } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { SupportedThings } from "./Rte";

// Only block-types used in block-type-map should be styled
type StylableBlockTypes = Extract<
    SupportedThings,
    "header-one" | "header-two" | "header-three" | "header-four" | "header-five" | "header-six" | "blockquote" | "unordered-list" | "ordered-list"
>;

export type RteBlockElementClassKey = StylableBlockTypes | "root";

export interface RteBlockElementProps extends TypographyProps {
    type?: StylableBlockTypes;
    component?: React.ElementType;
}

const RteBlockElement = ({ classes, type, ...restProps }: RteBlockElementProps & WithStyles<typeof styles>) => {
    return <Typography component="div" classes={{ root: `${classes.root} ${type ? classes[type] : ""}` }} {...restProps} />;
};

const styles = ({ palette }: Theme) => {
    return createStyles<RteBlockElementClassKey, RteBlockElementProps>({
        root: {
            fontSize: 16,
            lineHeight: "20px",
            fontWeight: 300,
            color: palette.grey[800],
            marginBottom: 10,
        },
        "header-one": {
            fontSize: 30,
            lineHeight: 1.2,
            fontWeight: 500,
        },
        "header-two": {
            fontSize: 28,
            lineHeight: 1.2,
            fontWeight: 500,
        },
        "header-three": {
            fontSize: 26,
            lineHeight: 1.2,
            fontWeight: 500,
        },
        "header-four": {
            fontSize: 22,
            lineHeight: 1.2,
            fontWeight: 500,
        },
        "header-five": {
            fontSize: 20,
            lineHeight: 1.2,
            fontWeight: 500,
        },
        "header-six": {
            fontSize: 18,
            lineHeight: 1.2,
            fontWeight: 500,
        },
        "ordered-list": {
            paddingLeft: 0,
        },
        "unordered-list": {
            paddingLeft: 0,
        },
        blockquote: {
            display: "block",
            position: "relative",
            paddingLeft: 20,
            paddingTop: 5,
            paddingBottom: 5,
            "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 2,
                width: 4,
                backgroundColor: palette.grey[200],
                borderRadius: 2,
            },
        },
    });
};

export const BlockElement = withStyles(styles, { name: "CometAdminRteBlockElement" })(RteBlockElement);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminRteBlockElement: RteBlockElementClassKey;
    }

    interface ComponentsPropsList {
        CometAdminRteBlockElement: Partial<RteBlockElementProps>;
    }

    interface Components {
        CometAdminRteBlockElement?: {
            defaultProps?: ComponentsPropsList["CometAdminRteBlockElement"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminRteBlockElement"];
        };
    }
}
