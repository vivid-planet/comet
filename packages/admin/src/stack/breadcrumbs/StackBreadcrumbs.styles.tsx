import { BreadcrumbsClassKey } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { createStyles } from "@mui/styles";

import { StackBreadcrumbsProps } from "./StackBreadcrumbs";

export type StackBreadcrumbsClassKey = BreadcrumbsClassKey | "link" | "last";

export const styles = ({ palette }: Theme) => {
    return createStyles<StackBreadcrumbsClassKey, StackBreadcrumbsProps>({
        root: {
            paddingTop: 30,
            paddingBottom: 30,
        },
        ol: {},
        li: {},
        separator: {
            color: palette.grey[300],
            "& [class*='MuiSvgIcon-root']": {
                fontSize: 12,
            },
            link: {
                color: palette.text.primary,
                textDecoration: "underline",
                "& [class*='MuiTypography']": {
                    fontSize: 13,
                    lineHeight: "14px",
                },
            },
        },
        link: {},
        last: {
            color: palette.text.disabled,
            "&, &:hover": {
                textDecoration: "none",
            },
        },
    });
};
