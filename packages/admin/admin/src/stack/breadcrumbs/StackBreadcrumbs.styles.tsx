import { BreadcrumbsClassKey } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { createStyles } from "@mui/styles";

import { StackBreadcrumbsProps } from "./StackBreadcrumbs";

export type StackBreadcrumbsClassKey =
    | BreadcrumbsClassKey
    | "breadcrumbs"
    | "backAndFirstLinkContainer"
    | "backButton"
    | "backButtonSeparator"
    | "link"
    | "overflowLink"
    | "lastLink";

export const styles = ({ palette, spacing, typography }: Theme) => {
    return createStyles<StackBreadcrumbsClassKey, StackBreadcrumbsProps>({
        root: {
            position: "relative",
        },
        breadcrumbs: {
            height: 50,
            borderBottom: `1px solid ${palette.divider}`,
        },
        backAndFirstLinkContainer: {
            display: "flex",
            alignItems: "center",
        },
        backButton: {},
        backButtonSeparator: {
            height: 30,
            width: 1,
            backgroundColor: palette.divider,
            marginRight: spacing(2),
        },
        ol: {
            flexWrap: "nowrap",
            height: "100%",
            overflowY: "auto", // Make the breadcrumbs scrollable, if they still take up too much space, when only the first, last & the overflow link are visible.
        },
        li: {
            whiteSpace: "nowrap",
        },
        separator: {
            fontSize: 12,
        },
        link: {
            fontSize: 13,
            lineHeight: "14px",
            fontWeight: typography.fontWeightMedium,
            color: palette.grey[600],
            textDecorationColor: "currentColor",
        },
        overflowLink: {
            cursor: "pointer",
        },
        lastLink: {
            color: palette.text.disabled,
            textDecoration: "none",
        },
    });
};
