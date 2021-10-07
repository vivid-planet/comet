import { BreadcrumbsClassKey } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { createStyles } from "@material-ui/styles";

import { StackBreadcrumbProps } from "./StackBreadcrumbs";

export type StackBreadcrumbsClassKey = BreadcrumbsClassKey | "link" | "last";

export const styles = ({ palette }: Theme) => {
    return createStyles<StackBreadcrumbsClassKey, StackBreadcrumbProps>({
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
