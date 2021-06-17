import { makeStyles, Typography, TypographyProps } from "@material-ui/core";
import { StyledComponentProps, Theme } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../mergeClasses"; // TODO: Import form "@comet/admin" after next release
import { SupportedThings } from "./Rte";

// Only block-types used in block-type-map should be styled
type StylableBlockTypes = Extract<
    SupportedThings,
    "header-one" | "header-two" | "header-three" | "header-four" | "header-five" | "header-six" | "blockquote" | "unordered-list" | "ordered-list"
>;

export type CometAdminRteBlockElementClassKeys = StylableBlockTypes | "root";

interface Props extends TypographyProps {
    type?: StylableBlockTypes;
    component?: React.ElementType;
}

export const BlockElement = ({ classes: passedClasses, type, ...restProps }: Props & StyledComponentProps<CometAdminRteBlockElementClassKeys>) => {
    const classes = mergeClasses<CometAdminRteBlockElementClassKeys>(useStyles(), passedClasses);
    return <Typography classes={{ root: `${classes.root} ${type ? classes[type] : ""}` }} {...restProps} />;
};

const useStyles = makeStyles<Theme, {}, CometAdminRteBlockElementClassKeys>(
    ({ palette }) => ({
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
    }),
    { name: "CometAdminRteBlockElement" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminRteBlockElement: CometAdminRteBlockElementClassKeys;
    }
}
