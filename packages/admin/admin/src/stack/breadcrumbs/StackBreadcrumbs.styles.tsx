import { Theme } from "@mui/material/styles";
import { createStyles } from "@mui/styles";

import { StackBreadcrumbsProps } from "./StackBreadcrumbs";

export type StackBreadcrumbsClassKey =
    | "root"
    | "breadcrumbs"
    | "listItem"
    | "link"
    | "disabledLink"
    | "overflowLink"
    | "separator"
    | "backButton"
    | "backButtonSeparator";

export const styles = ({ palette, typography }: Theme) =>
    createStyles<StackBreadcrumbsClassKey, StackBreadcrumbsProps>({
        root: {
            position: "relative",
        },
        breadcrumbs: {
            display: "flex",
            height: 50,
            borderBottom: `1px solid ${palette.divider}`,
            boxSizing: "border-box",
            flexWrap: "nowrap",
            overflowX: "auto", // Make the breadcrumbs scrollable, if they still take up too much space, when only the first, last & the overflow link are visible.
        },
        listItem: {
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            whiteSpace: "nowrap",
        },
        link: {
            fontSize: 13,
            lineHeight: "14px",
            fontWeight: typography.fontWeightMedium,
            color: palette.grey[600],
            textDecorationColor: "currentColor",
        },
        disabledLink: {
            color: palette.text.disabled,
        },
        overflowLink: {
            cursor: "pointer",
            paddingTop: 12,
            paddingBottom: 12,
        },
        separator: {
            fontSize: 12,
            lineHeight: 0,
            marginLeft: 8,
            marginRight: 8,
        },
        backButton: {},
        backButtonSeparator: {
            height: 30,
            width: 1,
            backgroundColor: palette.divider,
            marginRight: 12,
        },
    });
