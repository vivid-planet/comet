import { Theme } from "@mui/material/styles";
import { createStyles } from "@mui/styles";

import { ToolbarBreadcrumbsProps } from "./ToolbarBreadcrumbs";

export type ToolbarBreadcrumbsClassKey = "item" | "typographyRoot" | "typographyActiveRoot" | "separatorContainer" | "separator";

export const styles = ({ palette }: Theme) => {
    return createStyles<ToolbarBreadcrumbsClassKey, ToolbarBreadcrumbsProps>({
        item: {
            display: "flex",
            alignItems: "center",
            padding: 15,
        },
        typographyRoot: {
            fontSize: 18,
        },
        typographyActiveRoot: {
            color: palette.primary.main,
        },
        separatorContainer: {
            height: "100%",
            paddingLeft: 15,
            paddingRight: 15,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        separator: {
            height: 30,
            width: 1,
            backgroundColor: palette.divider,
            transform: "rotate(20deg)",
        },
    });
};
